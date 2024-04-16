use std::io::Write;
use std::process::{Command, Stdio};
use std::{thread, time};
use std::ops::{DerefMut, Index};
use std::sync::Mutex;
use serde::{Deserialize, Serialize};
use crate::schemas::BluetoothInfo;
use tauri::regex::Regex;

pub struct BluetoothSession {
    pub scanning: Mutex<bool>
}

#[derive(Serialize, Deserialize, Clone, PartialEq)]
pub struct DeviceInfo {
    pub address: String,
    pub name: String,
    pub trusted: bool,
    pub connected: bool,
}

unsafe impl Send for BluetoothSession {}

impl BluetoothSession {

    pub fn new() -> Self {
        BluetoothSession{
            scanning: Mutex::new(false)
        }
    } 
    
    pub async fn default_adapter_info(&self) -> BluetoothInfo {
        let output = std::process::Command::new("bluetoothctl")
            .arg("show")
            .output()
            .expect("failed to execute bluetoothctl show");
        
        let output = String::from_utf8_lossy(&output.stdout);
        let data = output.trim();
        
        let re_name = Regex::new(r"Name: (.+)").unwrap();
        let re_address = Regex::new(r"Controller (.+) \(public\)").unwrap();
        let re_visible = Regex::new(r"Discoverable: (\w+)").unwrap();
        let re_enabled = Regex::new(r"Powered: (\w+)").unwrap();

        let name = re_name.captures(data).unwrap().get(1).unwrap().as_str().trim().to_string();
        let address = re_address.captures(data).unwrap().get(1).unwrap().as_str().trim().to_string();
        let visible = re_visible.captures(data).unwrap().get(1).unwrap().as_str() == "yes";
        let enabled = re_enabled.captures(data).unwrap().get(1).unwrap().as_str() == "yes";


        BluetoothInfo {
            name,
            address,
            visible,
            enabled
        }
    }

    pub async fn toggle_visibility(&self, state: bool) -> BluetoothInfo {
        let mut arg = "on";
        if !state {
            arg = "off";
        }
        
        Command::new("bluetoothctl")
            .arg("discoverable")
            .arg(arg)
            .output()
            .expect("failed to execute bluetoothctl discoverable toggle");
        
        self.default_adapter_info().await
    }
    
    pub async fn power(&self, state: bool) -> BluetoothInfo {
        let mut arg = "on";
        if !state {
            arg = "off";
        }
        
        Command::new("bluetoothctl")
            .arg("power")
            .arg(arg)
            .output()
            .expect("failed to execute bluetoothctl power toggle");
        
        self.default_adapter_info().await
    }
    
    pub async fn scan(&self) {
        let mut bluetoothctl = Command::new("bluetoothctl")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .spawn()
            .expect("Failed to start bluetoothctl");

        let mut bluetoothctl_stdin = bluetoothctl.stdin.take().unwrap();

        bluetoothctl_stdin
            .write_all(b"scan on \n")
            .expect("Failed to send command to bluetoothctl");

        thread::sleep(time::Duration::from_secs(10))
    }

    pub async fn get_devices(&self) -> Vec<DeviceInfo> {
        let output = Command::new("bluetoothctl")
            .arg("devices")
            .output()
            .expect("failed to execute bluetoothctl devices");

        let output = String::from_utf8_lossy(&output.stdout);
        let data = output.trim();

        let re = Regex::new(r#"Device ([\w:]+) (.+)"#).unwrap();

        let mut devices = Vec::new();
        for cap in re.captures_iter(data) {
            let address = &cap[1];
            let name = &cap[2];

            let device = DeviceInfo {
                address: address.to_string(),
                name: name.to_string(),
                trusted: false,
                connected: false
            };

            devices.push(device);
        }

        let output = Command::new("bluetoothctl")
            .arg("devices")
            .arg("Paired")
            .output()
            .expect("failed to execute bluetoothctl devices");

        let output = String::from_utf8_lossy(&output.stdout);
        let data = output.trim();

        for cap in re.captures_iter(data) {
            let address = &cap[1];
            let name = &cap[2];

            let device = devices.iter_mut().find(|d| d.address == address).unwrap();
            device.trusted = true;
        }

        let output = Command::new("bluetoothctl")
            .arg("devices")
            .arg("Connected")
            .output()
            .expect("failed to execute bluetoothctl devices Connected");

        let output = String::from_utf8_lossy(&output.stdout);
        let data = output.trim();

        for cap in re.captures_iter(data) {
            let address = &cap[1];
            let name = &cap[2];

            let device = devices.iter_mut().find(|d| d.address == address);
            if device == None {
                continue;
            }
            
            device.unwrap().connected = true;
        }
        
        return devices.into_iter().filter(|device| {
            let device_data = device.clone();
            let name = device_data.name.replace("-", ":");
            let address = device_data.address;
            
            name != address
        }).collect()
    }

    pub async fn connect(&self, address: &str) -> Result<bool, ()> {
        let output = Command::new("bluetoothctl")
            .arg("connect")
            .arg(address)
            .output()
            .expect("failed to execute bluetoothctl connect");

        let output = String::from_utf8_lossy(&output.stdout);
        let data = output.trim();

        return Ok(data.contains("Connection successful"))
    }

    pub async fn disconnect(&self, address: &str) -> Result<bool, ()> {
        let output = Command::new("bluetoothctl")
            .arg("disconnect")
            .arg(address)
            .output()
            .expect("failed to execute bluetoothctl disconnect");
        
        let output = String::from_utf8_lossy(&output.stdout);
        let data = output.trim();
        
        return Ok(data.contains("Successful disconnected"))
    }
}
// Prevents additional console WINDOW on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod schemas;
mod bluetooth;
mod security;
mod wifi;

use std::fs;
use std::ops::Deref;
use tauri::{Manager, Window};
use crate::bluetooth::{BluetoothSession, DeviceInfo};
use crate::schemas::{BluetoothInfo, SecurityConfig, WifiStatus};
use tauri::State;
use crate::wifi::WifiSession;


#[tauri::command(async)]
async fn fullscreen(window: Window, flag: bool) -> Result<(), ()> {
    window.set_fullscreen(flag).expect("failed to set fullscreen");
    Ok(())
}

#[tauri::command]
async fn bluetooth_info(bluetooth: State<'_, BluetoothSession>) -> Result<BluetoothInfo, ()> {
    let value = bluetooth.default_adapter_info().await;
    Ok(value)
}

#[tauri::command]
async fn bluetooth_toggle_visibility(state: bool, bluetooth: State<'_, BluetoothSession>) -> Result<BluetoothInfo, ()> {
    let value = bluetooth.toggle_visibility(state).await;
    Ok(value)
}

#[tauri::command]
async fn kill() -> Result<(), String> {
    std::process::exit(0);
}

#[tauri::command]
async fn verify(code: String, security_config: State<'_, SecurityConfig>) -> Result<bool, ()> {
    if !security_config.check_pin(&code) {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command]
async fn bluetooth_power(state: bool, bluetooth: State<'_, BluetoothSession>) -> Result<BluetoothInfo, ()> {
    let value = bluetooth.power(state).await;
    Ok(value)
}

#[tauri::command]
async fn bluetooth_devices(bluetooth: State<'_, BluetoothSession>) -> Result<Vec<DeviceInfo>, ()> {
    let value = bluetooth.get_devices().await;
    Ok(value)
}

#[tauri::command]
async fn bluetooth_scan(bluetooth: State<'_, BluetoothSession>) -> Result<(), ()> {
    bluetooth.scan().await;
    Ok(())
}

#[tauri::command]
async fn wifi_info(wifi: State<'_, WifiSession>) -> Result<WifiStatus, ()> {
    let value = wifi.info().await;
    Ok(value)
}

#[tauri::command]
async fn wifi_toggle(state: bool, wifi: State<'_, WifiSession>) -> Result<WifiStatus, ()> {
    let value = wifi.toggle_wifi(state).await;
    Ok(value)
}

#[tauri::command]
async fn bluetooth_connect(device: String, bluetooth: State<'_, BluetoothSession>) -> Result<bool, ()> {
    bluetooth.connect(&device).await
}

#[tauri::command]
async fn bluetooth_disconnect(device: String, bluetooth: State<'_, BluetoothSession>) -> Result<bool, ()> {
    bluetooth.disconnect(&device).await
}

fn rs2js<R: tauri::Runtime>(message: String, manager: &impl Manager<R>) {
    manager
        .emit_all("rs2js", message)
        .unwrap();
}

fn main() {
    fs::create_dir_all("/etc/car").unwrap();

    tauri::Builder::default()
        .setup(|app| {
            app.manage(BluetoothSession::new());
            app.manage(SecurityConfig::new());
            app.manage(WifiSession::new());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            fullscreen,
            bluetooth_info,
            bluetooth_toggle_visibility,
            kill,
            verify,
            bluetooth_power,
            wifi_info,
            wifi_toggle,
            bluetooth_devices,
            bluetooth_scan,
            bluetooth_connect,
            bluetooth_disconnect
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

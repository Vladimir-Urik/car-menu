use crate::schemas::{WifiStatus};

pub struct WifiSession {
}

unsafe impl Send for WifiSession {}

impl WifiSession {

    pub fn new() -> Self {
        WifiSession{}
    } 
    
    pub async fn info(&self) -> WifiStatus {
        let output = std::process::Command::new("wifi")
            .output()
            .expect("failed to execute wifi");
        
        let output = String::from_utf8_lossy(&output.stdout);
        let data = output.trim();
        
        let enabled = data.contains("on");
        
        return WifiStatus {
            enabled
        }
    }

    pub async fn toggle_wifi(&self, state: bool) -> WifiStatus {
        let mut arg = "on";
        if !state {
            arg = "off";
        }
        
        std::process::Command::new("wifi")
            .arg(arg)
            .output()
            .expect("failed to execute wifi toggle");
        
        self.info().await
    }
    
    pub async fn power(&self, state: bool) -> WifiStatus {
        let mut arg = "on";
        if !state {
            arg = "off";
        }
        
        std::process::Command::new("bluetoothctl")
            .arg("power")
            .arg(arg)
            .output()
            .expect("failed to execute bluetoothctl power toggle");
        
        self.info().await
    }
}
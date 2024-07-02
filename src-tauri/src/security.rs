use std::fs;
use std::path::Path;
use std::sync::Mutex;

use crate::schemas::SecurityConfig;

unsafe impl Send for SecurityConfig {}

impl SecurityConfig {
    pub fn new() -> Self {
        if !Path::new("/etc/car/security.toml").exists() {
            let default = SecurityConfig {
                pin: Mutex::new("1234".to_string()),
                pin_enabled: Mutex::new(true),
            };
            let serialized = toml::to_string(&default).unwrap();
            fs::write("/etc/car/security.toml", serialized).unwrap();
        }
        
        let content = fs::read_to_string("/etc/car/security.toml").unwrap();
        let config: SecurityConfig = toml::from_str(&content).unwrap();
        
        config
    }
    
    pub fn save(&self) {
        let serialized = toml::to_string(&self).expect("Unable to serialize security config");
        fs::write("/etc/car/security.toml", serialized).expect("Unable to write security config");
    }
    
    pub fn check_pin(&self, pin: &str) -> bool {
        self.pin.lock().unwrap().eq(pin)
    }
}
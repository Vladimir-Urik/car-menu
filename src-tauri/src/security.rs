use std::fs;
use std::path::Path;
use crate::schemas::SecurityConfig;


unsafe impl Send for SecurityConfig {}

impl SecurityConfig {
    pub fn new() -> Self {
        if !Path::new("/etc/car/security.json").exists() {
            let default = SecurityConfig {
                pin: "1234".to_string(),
            };
            let serialized = serde_json::to_string(&default).unwrap();
            fs::write("/etc/car/security.json", serialized).unwrap();
        }
        
        let content = fs::read_to_string("/etc/car/security.json").unwrap();
        let config: SecurityConfig = serde_json::from_str(&content).unwrap();
        
        config
    }
    
    pub fn save(&self) {
        let serialized = serde_json::to_string(self).unwrap();
        fs::write("/etc/car/security.json", serialized).unwrap();
    }
    
    pub fn check_pin(&self, pin: &str) -> bool {
        self.pin == pin
    }
}
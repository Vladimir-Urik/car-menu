use std::fs;
use std::path::Path;
use std::sync::Mutex;

use crate::schemas::{GeneralSettings, SecurityConfig, Theme};

unsafe impl Send for GeneralSettings {}

impl GeneralSettings {
    pub fn new() -> Self {
        if !Path::new("/etc/car/general.toml").exists() {
            let default = GeneralSettings {
                theme: Theme {
                    darkmode: Mutex::new(false)
                },
            };
            let serialized = toml::to_string(&default).unwrap();
            fs::write("/etc/car/general.toml", serialized).unwrap();
        }

        let content = fs::read_to_string("/etc/car/general.toml").unwrap();
        let config: GeneralSettings = toml::from_str(&content).unwrap();

        config
    }

    pub fn save(&self) {
        let serialized = toml::to_string(&self).expect("Unable to serialize general config");
        fs::write("/etc/car/general.toml", serialized).expect("Unable to write general config");
    }

}

impl Theme {
    pub fn clone(&self) -> Self {
        Theme {
            darkmode: Mutex::new(*self.darkmode.lock().unwrap())
        }
    }
}
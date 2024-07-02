use std::sync::Mutex;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Default)]
pub struct BluetoothInfo {
    pub(crate) name: String,
    pub(crate) address: String,
    pub(crate) visible: bool,
    pub(crate) enabled: bool
}

#[derive(Serialize, Deserialize)]
pub struct SecurityConfig {
    pub(crate) pin: Mutex<String>,
    pub(crate) pin_enabled: Mutex<bool>
}

#[derive(Serialize, Deserialize)]
pub struct SaveSecurityConfig {
    pub pin: String,
    pub pin_enabled: bool
}

#[derive(Serialize, Deserialize, Default)]
pub struct WifiStatus {
    pub(crate) enabled: bool
}
#[derive(Serialize, Deserialize)]
pub struct SecurityPublicSettings {
    pub(crate) pin_enabled: bool
}

#[derive(Serialize, Deserialize)]
pub struct GeneralSettings {
    pub(crate) theme: Theme
}

#[derive(Serialize, Deserialize)]
pub struct Theme {
    pub darkmode: Mutex<bool>
}
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
    pub(crate) pin: String 
}

#[derive(Serialize, Deserialize, Default)]
pub struct WifiStatus {
    pub(crate) enabled: bool
}

// Prevents additional console WINDOW on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod schemas;
mod bluetooth;
mod security;
mod wifi;
mod general;

use std::fs;
use std::ops::Deref;
use log::__private_api::enabled;
use tauri::{Manager, Window};
use crate::bluetooth::{BluetoothSession, DeviceInfo};
use crate::schemas::{BluetoothInfo, GeneralSettings, SecurityConfig, SecurityPublicSettings, Theme, WifiStatus};
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

#[tauri::command]
async fn security_change_pin(new_pin: String, security_config: State<'_, SecurityConfig>) -> Result<(), ()> {
    let mut pin = security_config.pin.lock().unwrap();
    *pin = new_pin;
    security_config.save();
    Ok(())
}

#[tauri::command]
async fn security_change_pin_enabled(enabled: bool, security_config: State<'_, SecurityConfig>) -> Result<(), ()> {
    let mut pin_enabled = security_config.pin_enabled.lock().unwrap();
    *pin_enabled = enabled;
    drop(pin_enabled);
    security_config.save();
    Ok(())
}

#[tauri::command]
async fn security_public_settings(security_config: State<'_, SecurityConfig>) -> Result<SecurityPublicSettings, ()> {
    Ok(SecurityPublicSettings {
        pin_enabled: security_config.pin_enabled.lock().unwrap().deref().clone()
    })
}

#[tauri::command]
async fn theme_settings(settings: State<'_, GeneralSettings>) -> Result<Theme, ()> {
    Ok(settings.theme.clone())
}

#[tauri::command]
async fn theme_change_darkmode(state: bool, settings: State<'_, GeneralSettings>) -> Result<(), ()> {
    let mut darkmode = settings.theme.darkmode.lock().unwrap();
    *darkmode = state;
    drop(darkmode);
    settings.save();
    Ok(())
}

fn rs2js<R: tauri::Runtime>(message: String, manager: &impl Manager<R>) {
    manager
        .emit_all("rs2js", message)
        .unwrap();
}

fn main() {
    fs::create_dir_all("/etc/car").unwrap();

    // This should be called as early in the execution of the app as possible
    #[cfg(debug_assertions)] // only enable instrumentation in development builds
    let devtools = devtools::init();
    
    tauri::Builder::default()
        .setup(|app| {
            app.manage(BluetoothSession::new());
            app.manage(SecurityConfig::new());
            app.manage(WifiSession::new());
            app.manage(GeneralSettings::new());
            Ok(())
        })
        .plugin(devtools)
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
            bluetooth_disconnect,
            security_change_pin,
            security_change_pin_enabled,
            security_public_settings,
            theme_settings,
            theme_change_darkmode
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

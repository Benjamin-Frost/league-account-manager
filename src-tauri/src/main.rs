// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::ClientBuilder;
use sysinfo::{System, SystemExt};

#[tauri::command]
async fn lcu_login(url: &str, secret: &str, username: &str, password: &str) -> Result<(), String> {
    if is_league_client_running() {
        return Err("League Client already running".into());
    }
    
    let client = ClientBuilder::new()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();

    let res = client
    .put(url)
    .basic_auth("riot", Some(secret))
    .body(format!("{{\"username\": \"{}\", \"password\": \"{}\", \"persistLogin\": false}}", username, password))
    .send()
    .await;

    match res {
        Ok(_) => Ok(()),
        Err(_) =>  Err("Authentication failed".into())
    }
}

fn is_league_client_running() -> bool {
    let s = System::new_all();
    for _ in s.processes_by_name("LeagueClientUx") {
        return true;
    }
    false
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![lcu_login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

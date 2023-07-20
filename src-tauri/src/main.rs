// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::{ClientBuilder, StatusCode};
use sysinfo::{System, SystemExt};
use serde::{Serialize, Deserialize};

#[tauri::command]
async fn lcu_login(url: String, secret: String, username: String, password: String) -> Result<(), Error> {
    if is_league_client_running() {
        return Err(Error::AlreadyLoggedInError);
    }
    
    let client = ClientBuilder::new()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();

    let request = client
    .put(url)
    .basic_auth("riot", Some(secret))
    .body(format!("{{\"username\": \"{}\", \"password\": \"{}\", \"persistLogin\": false}}", username, password))
    .send()
    .await;

    let response = request.unwrap();
    let status = response.status();

    if status != StatusCode::CREATED {
        return Err(Error::RiotClientNotRunningError);
    }

    let body = response.text().await.unwrap();
    let json = serde_json::from_str::<RiotAuthResponse>(&body).unwrap();

    if json.error == "auth_failure" {
        return Err(Error::WrongCredentialsError);
    }

    if json.response_type == "authenticated" {
        return Ok(())
    } else {
        return Err(Error::UnknownError)
    }
}

fn is_league_client_running() -> bool {
    let s = System::new_all();
    for _ in s.processes_by_name("LeagueClientUx") {
        return true;
    }
    false
}

#[derive(Serialize, Deserialize, Debug)]
struct RiotAuthResponse {
    error: String,
    #[serde(rename = "type")]
    response_type: String,
}

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error("You are already logged in")]
    AlreadyLoggedInError,
    #[error("Please start the League Client first")]
    RiotClientNotRunningError,
    #[error("The account credentials are wrong")]
    WrongCredentialsError,
    #[error("An unknown error occured")]
    UnknownError,
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: serde::Serializer 
    {
        match self {
            _ => serializer.serialize_str(self.to_string().as_ref()) 
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![lcu_login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

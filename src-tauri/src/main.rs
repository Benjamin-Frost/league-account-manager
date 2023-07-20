// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::{ClientBuilder, StatusCode};
use sysinfo::{System, SystemExt};
use serde::{Serialize, Deserialize};

#[tauri::command]
async fn login(url: String, secret: String, username: String, password: String) -> Result<(), Error> {
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
    let json = serde_json::from_str::<AuthResponse>(&body).unwrap();

    if json.error == "auth_failure" {
        return Err(Error::WrongCredentialsError);
    }

    if json.response_type == "authenticated" {
        return Ok(())
    } else {
        return Err(Error::UnknownError)
    }
}

#[tauri::command]
async fn get_session(url: String, secret: String) -> Result<SessionResponse, Error> {
    let client = ClientBuilder::new()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();

    let request = client
    .get(url)
    .basic_auth("riot", Some(secret))
    .send()
    .await;

    let response = request.unwrap();
    let status = response.status();

    if status != StatusCode::OK {
        return Err(Error::LcuNotReachableError);
    }

    let body = response.text().await.unwrap();
    let json = serde_json::from_str::<SessionResponse>(&body).unwrap();

    Ok(json)
}

#[tauri::command]
async fn get_summoner(url: String, secret: String) -> Result<SummonerResponse, Error> {
    let client = ClientBuilder::new()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();

    let request = client
    .get(url)
    .basic_auth("riot", Some(secret))
    .send()
    .await;

    let response = request.unwrap();
    let status = response.status();

    if status != StatusCode::OK {
        return Err(Error::LcuNotReachableError);
    }

    let body = response.text().await.unwrap();
    let json = serde_json::from_str::<SummonerResponse>(&body).unwrap();

    Ok(json)
}

#[tauri::command]
async fn get_ranked(url: String, secret: String) -> Result<RankedStatsResponse, Error> {
    let client = ClientBuilder::new()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap();

    let request = client
    .get(url)
    .basic_auth("riot", Some(secret))
    .send()
    .await;

    let response = request.unwrap();
    let status = response.status();

    if status != StatusCode::OK {
        return Err(Error::LcuNotReachableError);
    }

    let body = response.text().await.unwrap();
    let json = serde_json::from_str::<RankedStatsResponse>(&body).unwrap();

    Ok(json)
}

fn is_league_client_running() -> bool {
    let s = System::new_all();
    for _ in s.processes_by_name("LeagueClientUx") {
        return true;
    }
    false
}

#[derive(Serialize, Deserialize, Debug)]
struct AuthResponse {
    error: String,
    #[serde(rename = "type")]
    response_type: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct SessionResponse {
    username: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct SummonerResponse {
    #[serde(rename = "displayName")]
    display_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct RankedQueueResponse {
    tier: String,
    division: String,
    #[serde(rename = "leaguePoints")]
    league_points: u32,
    wins: u32,
    losses: u32,
    #[serde(rename = "queueType")]
    queue_type: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct RankedStatsResponse {
    queues: Vec<RankedQueueResponse>,
}

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error("You are already logged in")]
    AlreadyLoggedInError,
    #[error("Please start the Riot Client first")]
    RiotClientNotRunningError,
    #[error("The account credentials are wrong")]
    WrongCredentialsError,
    #[error("The LCU is not reachable")]
    LcuNotReachableError,
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
        .invoke_handler(tauri::generate_handler![login, get_session, get_summoner, get_ranked])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

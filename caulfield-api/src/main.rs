mod error;
mod models;
mod routes;
mod state;

use sqlx::postgres::PgPoolOptions;
use state::AppState;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    // Load .env (development only — in production, real env vars are set directly)
    dotenvy::dotenv().ok();

    // Set up structured logging, controlled by RUST_LOG in .env
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::from_default_env())
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set (check your .env file)");

    // A connection pool, not a single connection — Axum will hand out
    // connections from this pool to concurrent requests as needed.
    let db = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("failed to connect to Postgres — is it running, and is DATABASE_URL correct?");

    let state = AppState { db };

    // Permissive CORS for local dev so Next.js (localhost:3000) can call
    // this API (localhost:8080). Tighten this before deploying.
    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);

    let app = routes::app_router()
        .with_state(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .expect("failed to bind to port");

    tracing::info!("caulfield-api listening on {}", listener.local_addr().unwrap());

    axum::serve(listener, app).await.expect("server error");
}

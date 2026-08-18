use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::json;

/// A single error type for the whole API. Every handler returns
/// `Result<T, AppError>`, and this converts any failure into an
/// HTTP response — so handlers never manually match on error kinds.
#[derive(Debug)]
pub enum AppError {
    NotFound,
    Database(sqlx::Error),
}

/// This trait impl is what lets you write `?` on a `sqlx::Result`
/// inside a handler and have it automatically become an `AppError`.
/// It's a very common Rust pattern: implement `From` once, then
/// error propagation with `?` "just works" everywhere.
impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => AppError::NotFound,
            other => AppError::Database(other),
        }
    }
}

/// Turns an AppError into an actual HTTP response — status code + JSON body.
impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let (status, message) = match self {
            AppError::NotFound => (StatusCode::NOT_FOUND, "resource not found".to_string()),
            AppError::Database(err) => {
                // Log the real error server-side, but don't leak DB
                // internals to the client — that's a security smell.
                tracing::error!("database error: {err:?}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "internal server error".to_string(),
                )
            }
        };

        (status, Json(json!({ "error": message }))).into_response()
    }
}

mod customers;
mod health;

use axum::{routing::get, Router};

use crate::state::AppState;

/// Builds the full application router. As you add resources
/// (orders, materials, invoices...) each gets its own module here,
/// e.g. `.merge(orders::router())`.
pub fn app_router() -> Router<AppState> {
    Router::new()
        .route("/health", get(health::health_check))
        .merge(customers::router())
}

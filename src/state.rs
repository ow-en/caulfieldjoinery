use sqlx::PgPool;

/// Shared state, cloned (cheaply — it's just a wrapped Arc internally)
/// into every request handler that needs it.
///
/// As the app grows this is where you'd add things like a config struct
/// or a client for an external service — but the DB pool is the only
/// thing every handler needs, so it's all we start with.
#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}

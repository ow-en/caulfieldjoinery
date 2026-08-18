use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use uuid::Uuid;

use crate::{
    error::AppError,
    models::{Customer, NewCustomer},
    state::AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/customers", get(list_customers).post(create_customer))
        .route(
            "/customers/{id}",
            get(get_customer).put(update_customer).delete(delete_customer),
        )
}

/// GET /customers
async fn list_customers(State(state): State<AppState>) -> Result<Json<Vec<Customer>>, AppError> {
    // query_as! is checked against your actual database AT COMPILE TIME —
    // if this SQL doesn't match the `customers` table, `cargo build` fails
    // with a real compiler error, not a runtime surprise. This requires
    // DATABASE_URL to be set (via .env) when you build.
    let customers = sqlx::query_as!(
        Customer,
        r#"SELECT id, name, email, phone, address, notes, created_at
           FROM customers ORDER BY created_at DESC"#
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(customers))
}

/// GET /customers/{id}
async fn get_customer(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Customer>, AppError> {
    let customer = sqlx::query_as!(
        Customer,
        r#"SELECT id, name, email, phone, address, notes, created_at
           FROM customers WHERE id = $1"#,
        id
    )
    .fetch_one(&state.db)
    .await?; // sqlx::Error::RowNotFound becomes AppError::NotFound automatically

    Ok(Json(customer))
}

/// POST /customers
async fn create_customer(
    State(state): State<AppState>,
    Json(new_customer): Json<NewCustomer>,
) -> Result<(StatusCode, Json<Customer>), AppError> {
    let customer = sqlx::query_as!(
        Customer,
        r#"INSERT INTO customers (name, email, phone, address, notes)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, name, email, phone, address, notes, created_at"#,
        new_customer.name,
        new_customer.email,
        new_customer.phone,
        new_customer.address,
        new_customer.notes
    )
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(customer)))
}

/// PUT /customers/{id}
async fn update_customer(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(updated): Json<NewCustomer>,
) -> Result<Json<Customer>, AppError> {
    let customer = sqlx::query_as!(
        Customer,
        r#"UPDATE customers
           SET name = $1, email = $2, phone = $3, address = $4, notes = $5
           WHERE id = $6
           RETURNING id, name, email, phone, address, notes, created_at"#,
        updated.name,
        updated.email,
        updated.phone,
        updated.address,
        updated.notes,
        id
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(customer))
}

/// DELETE /customers/{id}
async fn delete_customer(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    let result = sqlx::query!("DELETE FROM customers WHERE id = $1", id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(StatusCode::NO_CONTENT)
}

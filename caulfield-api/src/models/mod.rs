use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

/// Mirrors the `order_status` Postgres enum.
/// sqlx's `Type` derive maps this directly to/from the DB enum,
/// so an invalid status string simply can't exist in your Rust code —
/// the compiler enforces it.
#[derive(Debug, Serialize, Deserialize, sqlx::Type, Clone, PartialEq)]
#[sqlx(type_name = "order_status", rename_all = "snake_case")]
pub enum OrderStatus {
    Inquiry,
    Quoted,
    Confirmed,
    InProgress,
    Completed,
    Delivered,
    Cancelled,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Customer {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

/// Shape accepted for both creating and updating a customer —
/// no id, no created_at, since those aren't the client's to set.
#[derive(Debug, Deserialize)]
pub struct NewCustomer {
    pub name: String,
    pub email: String,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Material {
    pub id: Uuid,
    pub name: String,
    pub unit: String,
    pub cost_per_unit: Decimal,
    pub quantity_on_hand: Decimal,
    pub reorder_threshold: Decimal,
    pub supplier: Option<String>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Order {
    pub id: Uuid,
    pub customer_id: Uuid,
    pub status: OrderStatus,
    pub description: String,
    pub quoted_price: Option<Decimal>,
    pub deposit_amount: Option<Decimal>,
    pub estimated_hours: Option<Decimal>,
    pub due_date: Option<NaiveDate>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// A separate "new order" struct, distinct from `Order`.
/// This is a common Rust/API pattern: the shape of data coming IN
/// (no id, no timestamps — the DB generates those) is different from
/// the shape going OUT. Keeping them as separate types means the
/// compiler stops you from accidentally accepting a client-supplied id.
#[derive(Debug, Deserialize)]
pub struct NewOrder {
    pub customer_id: Uuid,
    pub description: String,
    pub quoted_price: Option<Decimal>,
    pub deposit_amount: Option<Decimal>,
    pub estimated_hours: Option<Decimal>,
    pub due_date: Option<NaiveDate>,
}

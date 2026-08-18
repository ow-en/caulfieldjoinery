-- Caulfield Joinery — Shop Management Schema
-- Postgres. Run via SQLx migrations once you set up the Rust project.

CREATE TYPE order_status AS ENUM (
    'inquiry',
    'quoted',
    'confirmed',
    'in_progress',
    'completed',
    'delivered',
    'cancelled'
);

CREATE TYPE invoice_status AS ENUM (
    'draft',
    'sent',
    'partially_paid',
    'paid',
    'overdue'
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Materials / inventory
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,               -- e.g. "White Oak"
    unit TEXT NOT NULL,                -- e.g. "board_ft", "each", "sheet"
    cost_per_unit NUMERIC(10, 2) NOT NULL,
    quantity_on_hand NUMERIC(10, 2) NOT NULL DEFAULT 0,
    reorder_threshold NUMERIC(10, 2) NOT NULL DEFAULT 0,
    supplier TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    status order_status NOT NULL DEFAULT 'inquiry',
    description TEXT NOT NULL,         -- what's being built
    quoted_price NUMERIC(10, 2),
    deposit_amount NUMERIC(10, 2),
    estimated_hours NUMERIC(6, 2),
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Materials consumed per order (many-to-many with quantity)
CREATE TABLE order_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id),
    quantity_used NUMERIC(10, 2) NOT NULL,
    UNIQUE (order_id, material_id)
);

-- Shop schedule — blocks of time assigned to an order
CREATE TABLE schedule_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    notes TEXT,
    CHECK (end_date >= start_date)
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    status invoice_status NOT NULL DEFAULT 'draft',
    amount_due NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0,
    issued_at TIMESTAMPTZ,
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ
);

-- Helpful indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_schedule_dates ON schedule_entries(start_date, end_date);
CREATE INDEX idx_invoices_order ON invoices(order_id);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
};

export type NewCustomer = {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    // Mirrors the { "error": "..." } shape your AppError returns
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  // DELETE returns 204 No Content — nothing to parse
  if (res.status === 204) return undefined as T;

  return res.json();
}

export const api = {
  customers: {
    list: () => request<Customer[]>("/customers"),
    get: (id: string) => request<Customer>(`/customers/${id}`),
    create: (data: NewCustomer) =>
      request<Customer>("/customers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: NewCustomer) =>
      request<Customer>(`/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/customers/${id}`, { method: "DELETE" }),
  },
};

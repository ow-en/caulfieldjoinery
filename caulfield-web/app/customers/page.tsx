"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { api, type NewCustomer } from "@/lib/api";
import { Button } from "@/components/ui/button";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export default function CustomersPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: customers, isLoading, isError, error } = useQuery({
    queryKey: ["customers"],
    queryFn: api.customers.list,
  });

  const createCustomer = useMutation({
    mutationFn: (data: NewCustomer) => api.customers.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setShowForm(false);
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: (id: string) => api.customers.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = handleSubmit((data) => {
    createCustomer.mutate(data);
    reset();
  });

  return (
    <div className="fade-in">
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-oak)] mb-3">
            Contacts
          </p>
          <h1 className="font-[family-name:var(--font-display)] font-semibold text-4xl tracking-tight text-[var(--color-ink)]">
            Customers
          </h1>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus size={16} className="mr-1.5" />
          New customer
        </Button>
      </div>
      <div className="tick-rule my-8" />

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="mb-10 bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-md p-8 grid grid-cols-2 gap-5"
        >
          <div className="col-span-1">
            <label className="block text-sm text-[var(--color-ink-muted)] mb-1">Name</label>
            <input
              {...register("name")}
              className="w-full border border-[var(--color-rule)] rounded-sm px-3 py-2 text-sm bg-white"
            />
            {errors.name && (
              <p className="text-xs text-[var(--color-rust)] mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-[var(--color-ink-muted)] mb-1">Email</label>
            <input
              {...register("email")}
              className="w-full border border-[var(--color-rule)] rounded-sm px-3 py-2 text-sm bg-white"
            />
            {errors.email && (
              <p className="text-xs text-[var(--color-rust)] mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-[var(--color-ink-muted)] mb-1">Phone</label>
            <input
              {...register("phone")}
              className="w-full border border-[var(--color-rule)] rounded-sm px-3 py-2 text-sm bg-white"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-[var(--color-ink-muted)] mb-1">Address</label>
            <input
              {...register("address")}
              className="w-full border border-[var(--color-rule)] rounded-sm px-3 py-2 text-sm bg-white"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-[var(--color-ink-muted)] mb-1">Notes</label>
            <textarea
              {...register("notes")}
              rows={2}
              className="w-full border border-[var(--color-rule)] rounded-sm px-3 py-2 text-sm bg-white"
            />
          </div>
          <div className="col-span-2 flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCustomer.isPending}>
              {createCustomer.isPending ? "Saving…" : "Save customer"}
            </Button>
          </div>
          {createCustomer.isError && (
            <p className="col-span-2 text-sm text-[var(--color-rust)]">
              {(createCustomer.error as Error).message}
            </p>
          )}
        </form>
      )}

      {isLoading && <p className="text-[var(--color-ink-muted)]">Loading customers…</p>}

      {isError && (
        <p className="text-[var(--color-rust)]">
          Couldn&apos;t reach the API: {(error as Error).message}. Is caulfield-api running on
          localhost:8080?
        </p>
      )}

      {customers && customers.length === 0 && (
        <p className="text-[var(--color-ink-muted)]">
          No customers yet. Add your first one above.
        </p>
      )}

      {customers && customers.length > 0 && (
        <div className="grid gap-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between rounded-md border border-[var(--color-rule)] bg-[var(--color-surface)] px-6 py-5 transition-all hover:border-[var(--color-oak)] hover:shadow-[0_4px_20px_-8px_rgba(43,33,24,0.12)]"
            >
              <div>
                <p className="font-[family-name:var(--font-display)] font-medium text-lg text-[var(--color-ink)]">{customer.name}</p>
                <p className="text-sm text-[var(--color-ink-muted)] mt-0.5">{customer.email}</p>
                {customer.phone && (
                  <p className="text-sm font-[family-name:var(--font-mono)] text-[var(--color-ink-faint)] mt-0.5">
                    {customer.phone}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteCustomer.mutate(customer.id)}
                className="text-[var(--color-ink-faint)] hover:text-[var(--color-rust)] p-2 transition-colors"
                aria-label={`Delete ${customer.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

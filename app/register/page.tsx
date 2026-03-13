"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("User created!");
      router.push("/api/auth/signin");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-10 space-y-4">
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2"
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border p-2"
      />

      <button className="bg-black text-white p-2">
        Register
      </button>
    </form>
  );
}
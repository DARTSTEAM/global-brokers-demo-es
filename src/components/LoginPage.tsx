"use client";

import { useState } from "react";
import { User, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

const DEMO_ACCOUNTS = ["Admin", "PGD", "EZE", "MAT", "URB"];

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(username, password);
    if (!result.success) setError(result.error ?? "Error al iniciar sesión");
  };

  const fillDemo = (account: string) => {
    const u = account.toLowerCase();
    setUsername(u);
    setPassword(u === "admin" ? "admin123" : `${u}2025`);
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">GB</div>
          <h1>Global Brokers</h1>
          <p>Portal de Seguimiento de Pedidos</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Usuario</label>
            <div className="form-input-wrapper">
              <User size={16} className="form-input-icon" aria-hidden="true" />
              <input
                id="login-username"
                className="form-input form-input-with-icon"
                type="text"
                placeholder="Ingresá tu usuario"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Contraseña</label>
            <div className="form-input-wrapper">
              <Lock size={16} className="form-input-icon" aria-hidden="true" />
              <input
                id="login-password"
                className="form-input form-input-with-icon"
                type="password"
                placeholder="Ingresá tu contraseña"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
              />
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="btn btn-primary btn-full" type="submit">
            Ingresar
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </form>

        <div className="login-demo-info">
          <p>Cuentas Demo</p>
          <div className="demo-accounts">
            {DEMO_ACCOUNTS.map((a) => (
              <button key={a} className="demo-chip" type="button" onClick={() => fillDemo(a)}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

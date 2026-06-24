"use client";

import { LayoutDashboard, Package, Users, FileText, LogOut, Grid3x3, Ship, Receipt } from "lucide-react";
import { useAuth } from "@/lib/auth";

type View = "panel" | "pedidos" | "clientes" | "proformas" | "cuadro" | "embarques" | "invoices";

interface SidebarProps {
  currentView: View;
  onNavigate: (v: View) => void;
  isOpen: boolean;
}

const navItems = (isAdmin: boolean) => [
  { key: "panel" as View,      label: "Panel",           icon: LayoutDashboard },
  { key: "pedidos" as View,    label: "Pedidos",         icon: Package },
  ...(isAdmin ? [{ key: "embarques" as View, label: "Embarques", icon: Ship }] : []),
  ...(isAdmin ? [{ key: "clientes" as View, label: "Clientes", icon: Users }] : []),
  { key: "invoices" as View,   label: "Invoices",        icon: Receipt },
  { key: "proformas" as View,  label: "Proformas",       icon: FileText },
  ...(isAdmin ? [{ key: "cuadro" as View, label: "Cuadro General", icon: Grid3x3 }] : []),
];

export default function Sidebar({ currentView, onNavigate, isOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">GB</div>
        <div>
          <h2>Global Brokers</h2>
          <span>{isAdmin ? "Portal Admin" : "Portal Cliente"}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Navegación</span>
        {navItems(isAdmin).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`sidebar-link ${currentView === key ? "active" : ""}`}
            onClick={() => onNavigate(key)}
          >
            <span className="sidebar-link-icon"><Icon size={18} /></span>
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{isAdmin ? "Administrador" : user?.company}</div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={logout}
          style={{ width: "100%", marginTop: 8 }}
        >
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

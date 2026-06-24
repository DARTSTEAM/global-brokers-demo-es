"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from "recharts";
import { ShoppingBag, Package, DollarSign, Users, TrendingUp, Loader, Ship, PackageCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getStatsGlobales, getStatsCliente, getPedidosCliente, pedidos, ESTADO, STATUS_COLORS, users } from "@/lib/data";

const fmtUSD = (v: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

const COLORES_ESTADO: Record<string, string> = {
  [ESTADO.EN_PRODUCCION]: "#2563EB",
  [ESTADO.CONTROL_CALIDAD]: "#7C3AED",
  [ESTADO.EN_TRANSITO]: "#D97706",
  [ESTADO.LLEGADO]: "#16A34A",
  [ESTADO.ENTREGADO]: "#15803D",
  [ESTADO.CANCELADO]: "#DC2626",
};

export default function Panel({ onVerPedido }: { onVerPedido: (id: string) => void }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const stats = isAdmin ? getStatsGlobales() : getStatsCliente(user!.id);
  const misPedidos = isAdmin ? pedidos : getPedidosCliente(user!.id);

  // Revenue by Client (admin) — use short labels
  const barData = isAdmin
    ? Object.values(users)
        .filter((u) => u.role === "client")
        .map((u) => ({
          name: u.id.toUpperCase(),
          importe: pedidos.filter((p) => p.clientId === u.id).reduce((s, p) => s + p.totalAmount, 0),
        }))
    : [];

  // Monthly Order Value — generate from order dates
  const monthlyData = (() => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const byMonth: Record<string, number> = {};
    misPedidos.forEach((p) => {
      const d = new Date(p.date + "T00:00:00");
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      byMonth[key] = (byMonth[key] || 0) + p.totalAmount;
    });
    const sorted = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b));
    return sorted.map(([key, value]) => {
      const [, m] = key.split("-");
      return { name: months[parseInt(m)], valor: value };
    });
  })();

  // Status distribution (donut)
  const pieData = Object.entries(
    misPedidos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Pedidos recientes
  const recientes = [...misPedidos].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  const totalClientes = isAdmin && "clientesUnicos" in stats ? (stats as ReturnType<typeof getStatsGlobales>).clientesUnicos : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">{isAdmin ? "Admin Dashboard" : `Panel — ${user?.company}`}</h1>
            <p className="page-subtitle">Global Brokers — Operations Overview</p>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* ── 5 stat cards ── */}
        <div className="stats-grid stats-grid-5">
          <div className="stat-card">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><ShoppingBag size={16} /></div>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-value">{stats.total}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><Loader size={16} /></div>
              <span className="stat-label">Active Orders</span>
            </div>
            <div className="stat-value">{stats.activos}</div>
            <div className="stat-detail">Currently in progress</div>
          </div>

          {isAdmin && (
            <div className="stat-card">
              <div className="stat-card-header-row">
                <div className="stat-icon-wrapper"><Users size={16} /></div>
                <span className="stat-label">Clients</span>
              </div>
              <div className="stat-value">{totalClientes}</div>
            </div>
          )}

          {!isAdmin && (
            <div className="stat-card">
              <div className="stat-card-header-row">
                <div className="stat-icon-wrapper"><Ship size={16} /></div>
                <span className="stat-label">En Tránsito</span>
              </div>
              <div className="stat-value">{("enTransito" in stats) ? (stats as ReturnType<typeof getStatsCliente>).enTransito : 0}</div>
            </div>
          )}

          <div className="stat-card">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><Package size={16} /></div>
              <span className="stat-label">Total Pieces</span>
            </div>
            <div className="stat-value">{stats.totalPzas.toLocaleString("es-AR")}</div>
          </div>

          <div className="stat-card stat-card-accent">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><DollarSign size={16} /></div>
              <span className="stat-label">Total Revenue</span>
            </div>
            <div className="stat-value">{fmtUSD(stats.totalImporte)}</div>
          </div>
        </div>

        {/* ── 3 charts ── */}
        <div className="charts-grid charts-grid-3">
          {/* Revenue by Client (bar) */}
          {isAdmin && (
            <div className="chart-card">
              <div className="chart-card-title"><TrendingUp size={13} /> Revenue by Client</div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500 }} interval={0} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [fmtUSD(Number(v)), "Revenue"]} />
                    <Bar dataKey="importe" fill="#8b7355" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Monthly Order Value (area) */}
          <div className="chart-card">
            <div className="chart-card-title"><Package size={13} /> Monthly Order Value</div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b7355" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8b7355" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [fmtUSD(Number(v)), "Order Value"]} />
                  <Area type="monotone" dataKey="valor" stroke="#8b7355" strokeWidth={2} fill="url(#gradientArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution (donut) */}
          <div className="chart-card">
            <div className="chart-card-title"><PackageCheck size={13} /> Status Distribution</div>
            <div className="chart-container chart-container-pie">
              <PieChart width={180} height={180}>
                <Pie data={pieData} cx={85} cy={85} innerRadius={50} outerRadius={80} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={COLORES_ESTADO[entry.name] ?? "#9CA3AF"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${String(v)} pedidos`, ""]} />
              </PieChart>
              <div className="chart-legend">
                {pieData.map((entry, i) => (
                  <div key={i} className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ backgroundColor: COLORES_ESTADO[entry.name] ?? "#9CA3AF" }} />
                    <span className="chart-legend-label">{entry.name}</span>
                    <span className="chart-legend-value">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pedidos recientes */}
        <div className="table-container">
          <div className="table-header">
            <span className="table-title">Pedidos Recientes</span>
          </div>
          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  {isAdmin && <th>Cliente</th>}
                  <th>Proveedor</th>
                  <th>Piezas</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recientes.map((p) => {
                  const colors = STATUS_COLORS[p.status] ?? { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" };
                  return (
                    <tr key={p.id} onClick={() => onVerPedido(p.id)}>
                      <td><strong>{p.orderNumber}</strong></td>
                      {isAdmin && <td>{users[p.clientId]?.company}</td>}
                      <td>{p.supplier}</td>
                      <td>{p.totalPcs.toLocaleString("es-AR")}</td>
                      <td><strong>{fmtUSD(p.totalAmount)}</strong></td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: colors.bg, color: colors.text }}>
                          <span className="status-dot" style={{ backgroundColor: colors.dot }} />
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

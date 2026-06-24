"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ShoppingBag, Package, DollarSign, Users, Loader, PackageCheck, Ship, TrendingUp } from "lucide-react";
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

  // Datos para gráfico de barras: pedidos por cliente (admin)
  const barData = isAdmin
    ? Object.values(users)
        .filter((u) => u.role === "client")
        .map((u) => ({
          name: u.company,
          pedidos: pedidos.filter((p) => p.clientId === u.id).length,
          importe: pedidos.filter((p) => p.clientId === u.id).reduce((s, p) => s + p.totalAmount, 0),
        }))
    : [];

  // Datos para gráfico de torta: por estado
  const pieData = Object.entries(
    misPedidos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Pedidos recientes
  const recientes = [...misPedidos].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Panel{isAdmin ? "" : ` — ${user?.company}`}</h1>
            <p className="page-subtitle">Resumen de operaciones de Global Brokers</p>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><ShoppingBag size={16} /></div>
              <span className="stat-label">Pedidos Totales</span>
            </div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-detail">{stats.activos} activos</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><Package size={16} /></div>
              <span className="stat-label">Piezas Totales</span>
            </div>
            <div className="stat-value">{stats.totalPzas.toLocaleString("es-AR")}</div>
            <div className="stat-detail">en todos los pedidos</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><DollarSign size={16} /></div>
              <span className="stat-label">Importe Total</span>
            </div>
            <div className="stat-value">{fmtUSD(stats.totalImporte)}</div>
            <div className="stat-detail">valor acumulado</div>
          </div>

          {isAdmin && "clientesUnicos" in stats && (
            <div className="stat-card">
              <div className="stat-card-header-row">
                <div className="stat-icon-wrapper"><Users size={16} /></div>
                <span className="stat-label">Clientes</span>
              </div>
              <div className="stat-value">{(stats as ReturnType<typeof getStatsGlobales>).clientesUnicos}</div>
              <div className="stat-detail">clientes activos</div>
            </div>
          )}

          {!isAdmin && "enTransito" in stats && (
            <div className="stat-card">
              <div className="stat-card-header-row">
                <div className="stat-icon-wrapper"><Ship size={16} /></div>
                <span className="stat-label">En Tránsito</span>
              </div>
              <div className="stat-value">{(stats as ReturnType<typeof getStatsCliente>).enTransito}</div>
              <div className="stat-detail">pedidos en camino</div>
            </div>
          )}
        </div>

        {/* Gráficos */}
        <div className={`charts-grid${isAdmin ? " charts-grid-3" : ""}`}>
          {/* Torta de estados */}
          <div className="chart-card">
            <div className="chart-card-title"><TrendingUp size={13} /> Pedidos por Estado</div>
            <div className="chart-container chart-container-pie">
              <PieChart width={180} height={160}>
                <Pie data={pieData} cx={85} cy={75} innerRadius={45} outerRadius={75} dataKey="value">
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

          {/* Barras por cliente (admin) */}
          {isAdmin && (
            <div className="chart-card">
              <div className="chart-card-title"><Package size={13} /> Pedidos por Cliente</div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="pedidos" fill="#8b7355" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Importes por cliente (admin) */}
          {isAdmin && (
            <div className="chart-card">
              <div className="chart-card-title"><DollarSign size={13} /> Importe por Cliente (USD)</div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [fmtUSD(Number(v)), "Importe"]} />
                    <Bar dataKey="importe" fill="#b8a080" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
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

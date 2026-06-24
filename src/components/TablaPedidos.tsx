"use client";

import { useState } from "react";
import { Search, ChevronRight, PackageOpen } from "lucide-react";
import { Pedido, STATUS_COLORS, users } from "@/lib/data";

const fmtUSD = (v: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });

interface Props {
  pedidos: Pedido[];
  onVerPedido: (id: string) => void;
  mostrarCliente?: boolean;
  titulo?: string;
}

export default function TablaPedidos({ pedidos, onVerPedido, mostrarCliente = false, titulo = "Pedidos" }: Props) {
  const [busqueda, setBusqueda] = useState("");

  const nombreCliente = (clientId: string) => users[clientId]?.company ?? clientId.toUpperCase();

  const filtrados = busqueda
    ? pedidos.filter((p) =>
        p.orderNumber.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.status.toLowerCase().includes(busqueda.toLowerCase()) ||
        (mostrarCliente && nombreCliente(p.clientId).toLowerCase().includes(busqueda.toLowerCase())) ||
        p.items.some((i) => i.description.toLowerCase().includes(busqueda.toLowerCase()))
      )
    : pedidos;

  return (
    <div className="table-container">
      <div className="table-header">
        <span className="table-title">{titulo}</span>
        <div className="table-header-right">
          <div className="table-search">
            <Search size={14} className="table-search-icon" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="table-search-input"
            />
          </div>
          <span className="table-count">{filtrados.length} pedidos</span>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><PackageOpen size={48} strokeWidth={1} /></div>
          <div className="empty-state-title">{busqueda ? "Sin resultados" : "Sin pedidos"}</div>
          <div className="empty-state-text">
            {busqueda ? "Probá con otro término de búsqueda" : "Los pedidos aparecerán aquí cuando sean creados"}
          </div>
        </div>
      ) : (
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Pedido</th>
                {mostrarCliente && <th>Cliente</th>}
                <th>Fecha</th>
                <th>Artículos</th>
                <th>Piezas</th>
                <th>Total</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const colors = STATUS_COLORS[p.status] ?? { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" };
                return (
                  <tr key={p.id} onClick={() => onVerPedido(p.id)}>
                    <td><strong>{p.orderNumber}</strong></td>
                    {mostrarCliente && <td>{nombreCliente(p.clientId)}</td>}
                    <td style={{ color: "var(--color-text-secondary)" }}>{fmtDate(p.date)}</td>
                    <td>{p.items.length} artículos</td>
                    <td>{p.totalPcs.toLocaleString("es-AR")}</td>
                    <td><strong>{fmtUSD(p.totalAmount)}</strong></td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: colors.bg, color: colors.text }}>
                        <span className="status-dot" style={{ backgroundColor: colors.dot }} />
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm btn-icon-only">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { Ship, MapPin, Calendar, Package, ChevronRight, Anchor } from "lucide-react";
import { pedidos, ESTADO, STATUS_COLORS, users } from "@/lib/data";

const fmtDate = (d: string | null) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }) : "—";

interface Props {
  onVerPedido: (id: string) => void;
}

export default function VistaEmbarques({ onVerPedido }: Props) {
  const embarques = pedidos.filter(
    (p) => p.status === ESTADO.EN_TRANSITO || p.status === ESTADO.LLEGADO
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Embarques</h1>
            <p className="page-subtitle">Pedidos embarcados y en tránsito — {embarques.length} embarques</p>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Stats rápidas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><Ship size={16} /></div>
              <span className="stat-label">En Tránsito</span>
            </div>
            <div className="stat-value">{embarques.filter((p) => p.status === ESTADO.EN_TRANSITO).length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><Anchor size={16} /></div>
              <span className="stat-label">Llegados</span>
            </div>
            <div className="stat-value">{embarques.filter((p) => p.status === ESTADO.LLEGADO).length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header-row">
              <div className="stat-icon-wrapper"><Package size={16} /></div>
              <span className="stat-label">Piezas en Tránsito</span>
            </div>
            <div className="stat-value">
              {embarques
                .filter((p) => p.status === ESTADO.EN_TRANSITO)
                .reduce((s, p) => s + p.totalPcs, 0)
                .toLocaleString("es-AR")}
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-container">
          <div className="table-header">
            <span className="table-title"><Ship size={15} /> Embarques</span>
            <span className="table-count">{embarques.length} registros</span>
          </div>

          {embarques.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Ship size={48} strokeWidth={1} /></div>
              <div className="empty-state-title">Sin embarques activos</div>
              <div className="empty-state-text">Los embarques aparecerán aquí cuando las órdenes sean despachadas</div>
            </div>
          ) : (
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Nro Pedido</th>
                    <th>Cliente</th>
                    <th>Proveedor</th>
                    <th>Puerto</th>
                    <th>Contenedor</th>
                    <th>F. Embarque</th>
                    <th>F. Llegada</th>
                    <th>Tracking</th>
                    <th>Estado</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {embarques.map((p) => {
                    const colors = STATUS_COLORS[p.status] ?? { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" };
                    return (
                      <tr key={p.id} onClick={() => onVerPedido(p.id)}>
                        <td><strong>{p.orderNumber}</strong></td>
                        <td>{users[p.clientId]?.company ?? p.clientId}</td>
                        <td>{p.supplier}</td>
                        <td>
                          {p.shipping.port ? (
                            <span className="puerto-badge"><MapPin size={10} /> {p.shipping.port}</span>
                          ) : "—"}
                        </td>
                        <td>{p.shipping.containerType ?? "—"}</td>
                        <td>{fmtDate(p.shipping.shipmentDate)}</td>
                        <td>{fmtDate(p.shipping.arrivalDate)}</td>
                        <td>
                          {p.shipping.forwarderTracking ? (
                            <code style={{ fontSize: ".75rem", color: "var(--color-accent)" }}>{p.shipping.forwarderTracking}</code>
                          ) : (
                            <span style={{ color: "var(--color-text-tertiary)" }}>—</span>
                          )}
                        </td>
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
      </div>
    </div>
  );
}

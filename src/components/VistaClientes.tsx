"use client";

import { users, getPedidosCliente, getStatsCliente } from "@/lib/data";

const fmtUSD = (v: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

interface Props {
  onVerCliente: (clientId: string) => void;
}

export default function VistaClientes({ onVerCliente }: Props) {
  const clientes = Object.values(users).filter((u) => u.role === "client");

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Clientes</h1>
            <p className="page-subtitle">{clientes.length} clientes registrados</p>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="admin-clients-grid">
          {clientes.map((cliente) => {
            const stats = getStatsCliente(cliente.id);
            const initials = cliente.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={cliente.id} className="client-card" onClick={() => onVerCliente(cliente.id)}>
                <div className="client-card-header">
                  <div className="client-card-avatar">{initials}</div>
                  <div>
                    <div className="client-card-name">{cliente.name}</div>
                    <div className="client-card-company">{cliente.company}</div>
                  </div>
                </div>
                <div className="client-card-stats">
                  <div className="client-stat">
                    <div className="client-stat-value">{stats.total}</div>
                    <div className="client-stat-label">Pedidos</div>
                  </div>
                  <div className="client-stat">
                    <div className="client-stat-value">{stats.activos}</div>
                    <div className="client-stat-label">Activos</div>
                  </div>
                  <div className="client-stat">
                    <div className="client-stat-value">{stats.totalPzas.toLocaleString("es-AR")}</div>
                    <div className="client-stat-label">Piezas</div>
                  </div>
                  <div className="client-stat">
                    <div className="client-stat-value">{fmtUSD(stats.totalImporte)}</div>
                    <div className="client-stat-label">Importe</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, Fragment } from "react";
import { ChevronDown, ExternalLink, Grid3x3, MapPin, User, Package, Layers } from "lucide-react";
import { cuadroGeneral, getStatsCuadro, CUADRO_STATUS, CUADRO_STATUS_COLORS, FilaCuadro } from "@/lib/data";

type Tab = "todos" | string;

export default function CuadroGeneral() {
  const [tabActiva, setTabActiva] = useState<Tab>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const stats = getStatsCuadro();

  const toggleExpand = (id: string) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filasFiltradas = cuadroGeneral.filter((f) => {
    if (tabActiva !== "todos" && f.temporada !== tabActiva) return false;
    if (filtroEstado && f.status !== filtroEstado) return false;
    return true;
  });

  const tabs = ["todos", ...Array.from(new Set(cuadroGeneral.map((f) => f.temporada).filter(Boolean)))];
  const estadosUnicos = Object.keys(CUADRO_STATUS);

  const badgeEstado = (status: string) => {
    const c = CUADRO_STATUS_COLORS[status] ?? { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" };
    return (
      <span className="status-badge" style={{ backgroundColor: c.bg, color: c.text }}>
        <span className="status-dot" style={{ backgroundColor: c.dot }} />
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Cuadro General</h1>
            <p className="page-subtitle">Seguimiento general de telas y materiales</p>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="cuadro-stats-row">
          {[
            { label: "Total Filas", value: stats.total, icon: <Grid3x3 size={14} /> },
            { label: "Clientes", value: stats.clientesUnicos, icon: <User size={14} /> },
            { label: "Proveedores", value: stats.proveedoresUnicos, icon: <Package size={14} /> },
            { label: "Estados", value: Object.keys(stats.byStatus).length, icon: <Layers size={14} /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="stat-card cuadro-stat-main">
              <div className="stat-card-header-row">
                <div className="stat-icon-wrapper">{icon}</div>
                <span className="stat-label">{label}</span>
              </div>
              <div className="stat-value">{value}</div>
            </div>
          ))}
        </div>

        {/* Tabs de temporada */}
        <div className="cuadro-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`cuadro-tab ${tabActiva === tab ? "active" : ""}`}
              onClick={() => { setTabActiva(tab); setFiltroEstado(null); }}
            >
              {tab === "todos" ? "Todos" : tab}
            </button>
          ))}
        </div>

        {/* Pills de estado */}
        <div className="cuadro-status-pills">
          <button
            className={`cuadro-pill ${filtroEstado === null ? "active" : ""}`}
            onClick={() => setFiltroEstado(null)}
          >
            Todos
            <span className="cuadro-pill-count">{filasFiltradas.length}</span>
          </button>
          {Object.values(CUADRO_STATUS).map((st) => {
            const count = filasFiltradas.filter((f) => f.status === st).length;
            if (count === 0) return null;
            return (
              <button
                key={st}
                className={`cuadro-pill ${filtroEstado === st ? "active" : ""}`}
                onClick={() => setFiltroEstado((prev) => (prev === st ? null : st))}
              >
                {st}
                <span className="cuadro-pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Tabla */}
        <div className="table-container">
          <div className="table-header">
            <span className="table-title">
              <Grid3x3 size={15} />
              Filas
              {filtroEstado && (
                <span className="table-filter-tag">{filtroEstado}</span>
              )}
            </span>
            <span className="table-count">{filasFiltradas.length} registros</span>
          </div>
          <div className="items-table-container">
            <table className="items-table cuadro-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Proveedor</th>
                  <th>Estado</th>
                  <th>Nombre Comercial</th>
                  <th>Artículo</th>
                  <th>Vendedor</th>
                  <th>Mes</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filasFiltradas.map((fila) => {
                  const isExpanded = expandidos.has(fila.id);
                  return (
                    <Fragment key={fila.id}>
                      <tr
                        className={`cuadro-clickable-row ${isExpanded ? "row-expanded" : ""}`}
                        onClick={() => toggleExpand(fila.id)}
                      >
                        <td>
                          <div className="cuadro-customer-cell">
                            <strong>{fila.customer}</strong>
                            {fila.subcustomer && <span className="cuadro-subcustomer">{fila.subcustomer}</span>}
                          </div>
                        </td>
                        <td>
                          <span className="supplier-badge">{fila.supplierId}</span>
                        </td>
                        <td>{badgeEstado(fila.status)}</td>
                        <td><strong style={{ fontSize: ".875rem" }}>{fila.commercialName}</strong></td>
                        <td><span className="cuadro-item-cell">{fila.item}</span></td>
                        <td>
                          {fila.vendedor ? (
                            <span className="vendedor-badge"><User size={10} />{fila.vendedor}</span>
                          ) : (
                            <span className="cuadro-empty-cell">—</span>
                          )}
                        </td>
                        <td>
                          {fila.mes ? (
                            <span style={{ fontSize: ".8125rem" }}>
                              {fila.mes}{fila.ano ? ` ${fila.ano}` : ""}
                            </span>
                          ) : (
                            <span className="cuadro-empty-cell">—</span>
                          )}
                        </td>
                        <td>
                          <button className={`cuadro-expand-btn ${isExpanded ? "expanded" : ""}`}>
                            <ChevronDown size={14} />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="cuadro-detail-row">
                          <td colSpan={8}>
                            <div className="cuadro-detail-content">
                              <div className="cuadro-detail-section">
                                <span className="cuadro-detail-label"><Package size={10} /> Artículo completo</span>
                                <span className="cuadro-detail-value">{fila.item}</span>
                              </div>
                              {fila.temporada && (
                                <div className="cuadro-detail-section">
                                  <span className="cuadro-detail-label">Temporada</span>
                                  <span className="cuadro-detail-value">{fila.temporada}</span>
                                </div>
                              )}
                              {fila.cuenta && (
                                <div className="cuadro-detail-section">
                                  <span className="cuadro-detail-label">Cuenta</span>
                                  <span className="cuadro-detail-value">{fila.cuenta}</span>
                                </div>
                              )}
                              {fila.seguimiento && (
                                <div className="cuadro-detail-section">
                                  <span className="cuadro-detail-label">Seguimiento</span>
                                  <span className="cuadro-detail-value">{fila.seguimiento}</span>
                                </div>
                              )}
                              {fila.puerto && (
                                <div className="cuadro-detail-section">
                                  <span className="cuadro-detail-label"><MapPin size={10} /> Puerto</span>
                                  <span className="cuadro-detail-value">
                                    <span className="puerto-badge"><MapPin size={10} />{fila.puerto}</span>
                                  </span>
                                </div>
                              )}
                              {fila.driveLink && (
                                <div className="cuadro-detail-section">
                                  <span className="cuadro-detail-label">Documentos</span>
                                  <a href={fila.driveLink} target="_blank" rel="noopener noreferrer" className="cuadro-drive-link">
                                    <ExternalLink size={11} /> Abrir en Drive
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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

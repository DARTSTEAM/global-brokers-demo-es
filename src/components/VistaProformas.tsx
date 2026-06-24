"use client";

import { useState } from "react";
import { Plus, Trash2, FileText } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { users, catalogoTelas } from "@/lib/data";

interface ItemProforma {
  nombreComercial: string;
  articulo: string;
  color: string;
  cantidad: number;
  unidad: "KG" | "MTS";
  precioFOB: number;
  precioCustomer: number;
}

const itemVacio = (): ItemProforma => ({
  nombreComercial: "", articulo: "", color: "", cantidad: 0, unidad: "KG", precioFOB: 0, precioCustomer: 0,
});

const fmtUSD = (v: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);

export default function VistaProformas() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [modo, setModo] = useState<"lista" | "nueva" | "preview">("lista");
  const [clienteId, setClienteId] = useState(isAdmin ? "" : user!.id);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [condicionPago, setCondicionPago] = useState("");
  const [notas, setNotas] = useState("");
  const [items, setItems] = useState<ItemProforma[]>([itemVacio()]);

  const clientesOpciones = Object.values(users).filter((u) => u.role === "client");
  const clienteSelec = users[clienteId];

  const subtotal = items.reduce((s, i) => s + i.cantidad * i.precioCustomer, 0);

  const actualizarItem = (idx: number, campo: keyof ItemProforma, valor: string | number) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [campo]: valor } : it)));
  };

  const seleccionarTela = (idx: number, telaId: string) => {
    const tela = catalogoTelas.find((t) => t.id === telaId);
    if (tela) {
      setItems((prev) =>
        prev.map((it, i) =>
          i === idx ? { ...it, nombreComercial: tela.commercialName, articulo: tela.composition } : it
        )
      );
    }
  };

  const agregarItem = () => setItems((prev) => [...prev, itemVacio()]);
  const quitarItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const proformaNum = `PRF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

  if (modo === "preview") {
    return (
      <div>
        <div className="page-header">
          <div className="page-header-row">
            <div>
              <h1 className="page-title">Vista Previa de Proforma</h1>
              <p className="page-subtitle">{proformaNum}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setModo("nueva")}>Editar</button>
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>Imprimir / Exportar</button>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="proforma-preview">
            <div className="proforma-preview-header">
              <div>
                <div className="proforma-preview-brand">Global Brokers</div>
                <div className="proforma-preview-subtitle">Proforma de Pedido — Textiles</div>
              </div>
              <div className="proforma-preview-meta">
                <span className="proforma-meta-label">Número</span>
                <strong>{proformaNum}</strong>
                <span className="proforma-meta-label" style={{ marginTop: 8 }}>Fecha</span>
                <span>{new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>

            {clienteSelec && (
              <div className="proforma-preview-client">
                <div className="proforma-meta-label">Cliente</div>
                <strong>{clienteSelec.name}</strong>
                <div>{clienteSelec.company}</div>
              </div>
            )}

            <div className="proforma-items-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre Comercial</th>
                    <th>Artículo / Composición</th>
                    <th>Color</th>
                    <th style={{ textAlign: "right" }}>Cantidad</th>
                    <th>Unid.</th>
                    <th style={{ textAlign: "right" }}>P. Customer</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} style={{ cursor: "default" }}>
                      <td>{i + 1}</td>
                      <td><strong>{item.nombreComercial}</strong></td>
                      <td style={{ fontSize: ".8125rem" }}>{item.articulo}</td>
                      <td>{item.color}</td>
                      <td style={{ textAlign: "right" }}>{item.cantidad.toLocaleString("es-AR")}</td>
                      <td>{item.unidad}</td>
                      <td style={{ textAlign: "right" }}>{fmtUSD(item.precioCustomer)}</td>
                      <td style={{ textAlign: "right" }}><strong>{fmtUSD(item.cantidad * item.precioCustomer)}</strong></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7} style={{ textAlign: "right", fontWeight: 600 }}>Total USD</td>
                    <td style={{ textAlign: "right" }}><strong style={{ color: "var(--color-accent)", fontSize: "1.1rem" }}>{fmtUSD(subtotal)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {condicionPago && (
              <div className="proforma-preview-section">
                <div className="proforma-meta-label">Condición de Pago</div>
                <p>{condicionPago}</p>
              </div>
            )}
            {notas && (
              <div className="proforma-preview-section" style={{ marginTop: 16 }}>
                <div className="proforma-meta-label">Notas</div>
                <p>{notas}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (modo === "nueva") {
    return (
      <div>
        <div className="page-header">
          <div className="page-header-row">
            <div>
              <h1 className="page-title">Nueva Proforma</h1>
              <p className="page-subtitle">Completá los datos de la proforma textil</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setModo("lista")}>Cancelar</button>
              <button className="btn btn-primary btn-sm" onClick={() => setModo("preview")}>Vista Previa</button>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="proforma-form">
            {/* Encabezado */}
            <div className="detail-card">
              <div className="detail-card-title"><FileText size={14} /> Datos Generales</div>
              <div className="proforma-form-grid">
                {isAdmin && (
                  <div className="form-group">
                    <label className="form-label">Cliente</label>
                    <select className="form-input" value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                      <option value="">Seleccioná un cliente...</option>
                      {clientesOpciones.map((c) => (
                        <option key={c.id} value={c.id}>{c.company} — {c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input type="date" className="form-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Condición de Pago</label>
                  <input type="text" className="form-input" placeholder="Ej: 20% ADV + 80% Against Arrival" value={condicionPago} onChange={(e) => setCondicionPago(e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Notas adicionales</label>
                  <textarea className="form-input form-textarea" placeholder="Observaciones, aclaraciones..." value={notas} onChange={(e) => setNotas(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Artículos */}
            <div className="detail-card">
              <div className="detail-card-title"><Plus size={14} /> Artículos — Telas</div>
              {items.map((item, idx) => (
                <div key={idx} className="proforma-item-row">
                  <div className="proforma-item-number">{idx + 1}</div>
                  <div className="proforma-item-fields">
                    <div className="proforma-form-grid">
                      <div className="form-group">
                        <label className="form-label">Nombre Comercial</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <select className="form-input" value="" onChange={(e) => seleccionarTela(idx, e.target.value)} style={{ flex: "0 0 auto", width: "auto" }}>
                            <option value="">Catálogo...</option>
                            {catalogoTelas.map((t) => (
                              <option key={t.id} value={t.id}>{t.commercialName}</option>
                            ))}
                          </select>
                          <input className="form-input" value={item.nombreComercial} onChange={(e) => actualizarItem(idx, "nombreComercial", e.target.value)} placeholder="Ej: Stella, Barbie, Bengalina" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Artículo / Composición</label>
                        <input className="form-input" value={item.articulo} onChange={(e) => actualizarItem(idx, "articulo", e.target.value)} placeholder="Ej: FLS553 92%P 8%SP 160CM 260/270GSM" />
                      </div>
                    </div>
                    <div className="proforma-item-fields-row">
                      <div className="form-group">
                        <label className="form-label">Color</label>
                        <input className="form-input" value={item.color} onChange={(e) => actualizarItem(idx, "color", e.target.value)} placeholder="Color" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Cantidad</label>
                        <input type="number" className="form-input" value={item.cantidad || ""} onChange={(e) => actualizarItem(idx, "cantidad", Number(e.target.value))} min={0} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Unidad</label>
                        <select className="form-input" value={item.unidad} onChange={(e) => actualizarItem(idx, "unidad", e.target.value)}>
                          <option value="KG">KG</option>
                          <option value="MTS">MTS</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">P. FOB NET (USD)</label>
                        <input type="number" className="form-input" value={item.precioFOB || ""} onChange={(e) => actualizarItem(idx, "precioFOB", Number(e.target.value))} min={0} step={0.01} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">P. Customer (USD)</label>
                        <input type="number" className="form-input" value={item.precioCustomer || ""} onChange={(e) => actualizarItem(idx, "precioCustomer", Number(e.target.value))} min={0} step={0.01} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Total</label>
                        <div className="proforma-line-total">{fmtUSD(item.cantidad * item.precioCustomer)}</div>
                      </div>
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button className="btn btn-ghost btn-sm proforma-remove-btn" onClick={() => quitarItem(idx)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button className="btn btn-secondary btn-sm" onClick={agregarItem} style={{ marginTop: 8 }}>
                <Plus size={14} /> Agregar artículo
              </button>

              <div className="proforma-totals">
                <div className="proforma-totals-row">
                  <span>Subtotal</span>
                  <span>{fmtUSD(subtotal)}</span>
                </div>
                <div className="proforma-totals-row proforma-totals-grand">
                  <span>Total USD</span>
                  <strong>{fmtUSD(subtotal)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Proformas</h1>
            <p className="page-subtitle">Gestión de proformas de pedidos textiles</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setModo("nueva")}>
            <Plus size={14} /> Nueva Proforma
          </button>
        </div>
      </div>
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon"><FileText size={48} strokeWidth={1} /></div>
          <div className="empty-state-title">Sin proformas guardadas</div>
          <div className="empty-state-text">Creá una nueva proforma usando el botón de arriba</div>
        </div>
      </div>
    </div>
  );
}

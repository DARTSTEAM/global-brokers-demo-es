"use client";

import { useState } from "react";
import { FileText, Plus, ChevronRight, Printer, ArrowLeft, Ship, DollarSign, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  invoices, Invoice, ItemInvoice, getInvoicesCliente,
  pedidos, ESTADO, users, datosFacturacion,
} from "@/lib/data";

const fmtUSD = (v: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

function numberToWords(n: number): string {
  // Simplified English number-to-words for the "SAY TOTAL..." line
  const ones = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
    "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
  const tens = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
  const integer = Math.floor(n);
  const cents = Math.round((n - integer) * 100);
  const centsStr = cents > 0 ? ` AND ${cents < 20 ? ones[cents] : tens[Math.floor(cents / 10)] + (cents % 10 ? " " + ones[cents % 10] : "")} CENTS` : "";

  if (integer === 0) return "ZERO" + centsStr;
  const chunks: string[] = [];
  const scales = ["", "THOUSAND", "MILLION"];
  let remaining = integer;
  let scaleIdx = 0;
  while (remaining > 0) {
    const chunk = remaining % 1000;
    if (chunk > 0) {
      const h = Math.floor(chunk / 100);
      const t = chunk % 100;
      let s = "";
      if (h > 0) s += ones[h] + " HUNDRED";
      if (t > 0) {
        if (s) s += " ";
        s += t < 20 ? ones[t] : tens[Math.floor(t / 10)] + (t % 10 ? " " + ones[t % 10] : "");
      }
      if (scales[scaleIdx]) s += " " + scales[scaleIdx];
      chunks.unshift(s);
    }
    remaining = Math.floor(remaining / 1000);
    scaleIdx++;
  }
  return chunks.join(" ") + centsStr;
}

// ─── Preview de Invoice ──────────────────────────────────────────────────────

function InvoicePreview({ invoice, onVolver }: { invoice: Invoice; onVolver: () => void }) {
  const billing = datosFacturacion[invoice.clientId];
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <button className="back-link" onClick={onVolver}><ArrowLeft size={14} /> Volver a Invoices</button>
            <h1 className="page-title">Invoice {invoice.nroInvoice}</h1>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Printer size={14} /> Imprimir / Exportar
          </button>
        </div>
      </div>
      <div className="page-body">
        <div className="invoice-preview">
          {/* Header */}
          <div className="invoice-preview-header">
            <div>
              <div className="invoice-preview-brand">LN GROUP CO., LIMITED</div>
              <div className="invoice-preview-address">
                Flat C, 23/F, Lucky Plaza, 315-321 Lockhart Road,<br />
                Wan Chai, Hong Kong<br />
                Tel: (852) 98559321
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="invoice-preview-title">COMMERCIAL INVOICE</div>
            </div>
          </div>

          {/* Client + invoice info */}
          <div className="invoice-info-grid">
            <div className="invoice-info-block">
              <div className="invoice-info-label">TO:</div>
              <div className="invoice-info-value">
                <strong>{billing?.cnee ?? users[invoice.clientId]?.company}</strong><br />
                {billing?.direccion}<br />
                {billing?.localidadPais}<br />
                {billing?.cuit}
              </div>
            </div>
            <div className="invoice-info-block" style={{ textAlign: "right" }}>
              <div className="invoice-info-row">
                <span className="invoice-info-label">INVOICE NO:</span>
                <strong>{invoice.nroInvoice}</strong>
              </div>
              <div className="invoice-info-row">
                <span className="invoice-info-label">DATE:</span>
                <span>{fmtDate(invoice.fecha)}</span>
              </div>
            </div>
          </div>

          {/* Route + payment */}
          <div className="invoice-route">
            <span>From: <strong>{invoice.desde}</strong></span>
            <span>To: <strong>{invoice.hasta}</strong></span>
          </div>
          <div className="invoice-payment-terms">
            Payment Terms: {invoice.condicionPago}
          </div>

          {/* Items table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>Marks</th>
                <th>Descriptions</th>
                <th style={{ textAlign: "right" }}>Quantities</th>
                <th style={{ width: "50px" }}></th>
                <th style={{ textAlign: "right" }}>Unit Price</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ cursor: "default" }}>
                <td colSpan={6} style={{ fontWeight: 600, color: "var(--color-text-secondary)", paddingTop: 12 }}>
                  TEXTILE FABRIC
                </td>
              </tr>
              {invoice.items.map((item, i) => (
                <tr key={i} style={{ cursor: "default" }}>
                  <td></td>
                  <td>{item.articulo}</td>
                  <td style={{ textAlign: "right" }}>{item.cantidad.toLocaleString("es-AR", { minimumFractionDigits: 1 })}</td>
                  <td>{item.unidad}</td>
                  <td style={{ textAlign: "right" }}>{fmtUSD(item.precioUnit)}</td>
                  <td style={{ textAlign: "right" }}><strong>{fmtUSD(item.total)}</strong></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td style={{ fontWeight: 600 }}>Total Quantity</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>
                  {invoice.totalCantidad.toLocaleString("es-AR", { minimumFractionDigits: 1 })}
                </td>
                <td>{invoice.items[0]?.unidad}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style={{ fontWeight: 700, fontSize: "1rem" }}>TOTAL FOB</td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right", fontWeight: 700, fontSize: "1rem", color: "var(--color-accent)" }}>
                  {fmtUSD(invoice.totalFOB)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Say total */}
          <div className="invoice-say-total">
            SAY TOTAL U.S. DOLLARS {numberToWords(invoice.totalFOB)} ONLY
          </div>
          <div className="invoice-payment-footer">
            Payment Terms: {invoice.condicionPago}
          </div>

          {/* Bank info */}
          <div className="invoice-bank">
            <div className="invoice-info-label">Bank Details</div>
            <div>Bank Name: OCBC Bank (Hong Kong) Limited</div>
            <div>Company Name: LN GROUP CO., LIMITED</div>
            <div>Account: 035 802 512143831</div>
            <div>Bank Address: 161 Queen&apos;s Road Central, Hong Kong</div>
            <div>Swift Code: WIHBHKHH</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Generador de Invoice ────────────────────────────────────────────────────

function GeneradorInvoice({ onVolver, onPreview }: { onVolver: () => void; onPreview: (inv: Invoice) => void }) {
  const pedidosEmbarcados = pedidos.filter(
    (p) => p.status === ESTADO.EN_TRANSITO || p.status === ESTADO.LLEGADO || p.status === ESTADO.ENTREGADO
  );

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState("");
  const [items, setItems] = useState<ItemInvoice[]>([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  const pedido = pedidosEmbarcados.find((p) => p.id === pedidoSeleccionado);

  const seleccionarPedido = (id: string) => {
    setPedidoSeleccionado(id);
    const p = pedidosEmbarcados.find((o) => o.id === id);
    if (p) {
      setItems(
        p.items.map((it) => ({
          articulo: `${it.nameStyle} - ${it.color} - ${it.itemId} ${it.composition}`,
          cantidad: it.finalQuantity ?? it.quantity,
          unidad: "KG" as const,
          precioUnit: it.priceCustomer,
          total: (it.finalQuantity ?? it.quantity) * it.priceCustomer,
        }))
      );
    }
  };

  const actualizarItem = (idx: number, campo: keyof ItemInvoice, valor: string | number) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== idx) return it;
        const updated = { ...it, [campo]: valor };
        if (campo === "cantidad" || campo === "precioUnit") {
          updated.total = Number(updated.cantidad) * Number(updated.precioUnit);
        }
        return updated;
      })
    );
  };

  const totalCantidad = items.reduce((s, it) => s + it.cantidad, 0);
  const totalFOB = items.reduce((s, it) => s + it.total, 0);

  const generarPreview = () => {
    if (!pedido) return;
    const billing = datosFacturacion[pedido.clientId];
    const inv: Invoice = {
      id: `inv-new-${Date.now()}`,
      pedidoId: pedido.id,
      clientId: pedido.clientId,
      nroInvoice: `${pedido.orderNumber.replace(/\s/g, "")}`,
      fecha,
      cuenta: "LN",
      desde: pedido.shipping.port ?? "China",
      hasta: "Buenos Aires, Argentina",
      condicionPago: pedido.paymentCondition,
      items,
      totalCantidad,
      totalFOB,
    };
    onPreview(inv);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Generar Invoice</h1>
            <p className="page-subtitle">Seleccioná un pedido embarcado para generar la commercial invoice</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={onVolver}>Cancelar</button>
            <button className="btn btn-primary btn-sm" disabled={!pedido || items.length === 0} onClick={generarPreview}>
              Vista Previa
            </button>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="proforma-form">
          <div className="detail-card">
            <div className="detail-card-title"><Ship size={14} /> Pedido Embarcado</div>
            <div className="proforma-form-grid">
              <div className="form-group">
                <label className="form-label">Pedido</label>
                <select className="form-input" value={pedidoSeleccionado} onChange={(e) => seleccionarPedido(e.target.value)}>
                  <option value="">Seleccioná un pedido...</option>
                  {pedidosEmbarcados.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.orderNumber} — {users[p.clientId]?.company} ({p.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha Invoice</label>
                <input type="date" className="form-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>
            </div>
            {pedido && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--color-accent-subtle)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: ".8125rem", color: "var(--color-text-secondary)" }}>
                  <strong>{users[pedido.clientId]?.company}</strong> · Proveedor: {pedido.supplier} · Puerto: {pedido.shipping.port ?? "—"} · Tracking: {pedido.shipping.forwarderTracking ?? "—"}
                </div>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="detail-card">
              <div className="detail-card-title"><FileText size={14} /> Artículos</div>
              {items.map((item, idx) => (
                <div key={idx} className="proforma-item-row">
                  <div className="proforma-item-number">{idx + 1}</div>
                  <div className="proforma-item-fields">
                    <div className="form-group">
                      <label className="form-label">Artículo</label>
                      <input className="form-input" value={item.articulo} onChange={(e) => actualizarItem(idx, "articulo", e.target.value)} />
                    </div>
                    <div className="proforma-item-fields-row">
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
                        <label className="form-label">P. Unit. (USD)</label>
                        <input type="number" className="form-input" value={item.precioUnit || ""} onChange={(e) => actualizarItem(idx, "precioUnit", Number(e.target.value))} min={0} step={0.01} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Total</label>
                        <div className="proforma-line-total">{fmtUSD(item.total)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="proforma-totals">
                <div className="proforma-totals-row">
                  <span>Total Cantidad</span>
                  <span>{totalCantidad.toLocaleString("es-AR", { minimumFractionDigits: 1 })} {items[0]?.unidad}</span>
                </div>
                <div className="proforma-totals-row proforma-totals-grand">
                  <span>TOTAL FOB USD</span>
                  <strong>{fmtUSD(totalFOB)}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Componente Principal ────────────────────────────────────────────────────

export default function VistaInvoices() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [modo, setModo] = useState<"lista" | "nueva" | "preview">("lista");
  const [invoicePreview, setInvoicePreview] = useState<Invoice | null>(null);

  const misInvoices = isAdmin ? invoices : getInvoicesCliente(user!.id);

  const handlePreview = (inv: Invoice) => {
    setInvoicePreview(inv);
    setModo("preview");
  };

  const verInvoice = (inv: Invoice) => {
    setInvoicePreview(inv);
    setModo("preview");
  };

  if (modo === "preview" && invoicePreview) {
    return <InvoicePreview invoice={invoicePreview} onVolver={() => { setModo("lista"); setInvoicePreview(null); }} />;
  }

  if (modo === "nueva") {
    return <GeneradorInvoice onVolver={() => setModo("lista")} onPreview={handlePreview} />;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Invoices</h1>
            <p className="page-subtitle">{isAdmin ? "Todas las invoices generadas" : "Tus invoices"}</p>
          </div>
          {isAdmin && (
            <button className="btn btn-primary btn-sm" onClick={() => setModo("nueva")}>
              <Plus size={14} /> Generar Invoice
            </button>
          )}
        </div>
      </div>

      <div className="page-body">
        {misInvoices.length === 0 ? (
          <div className="table-container">
            <div className="empty-state">
              <div className="empty-state-icon"><FileText size={48} strokeWidth={1} /></div>
              <div className="empty-state-title">Sin invoices</div>
              <div className="empty-state-text">
                {isAdmin ? "Generá una invoice desde un pedido embarcado" : "Las invoices aparecerán aquí cuando sean generadas"}
              </div>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <div className="table-header">
              <span className="table-title"><FileText size={15} /> Invoices Generadas</span>
              <span className="table-count">{misInvoices.length} invoices</span>
            </div>
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Nro Invoice</th>
                    {isAdmin && <th>Cliente</th>}
                    <th>Fecha</th>
                    <th>Cuenta</th>
                    <th>Artículos</th>
                    <th>Total FOB</th>
                    <th>Ruta</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {misInvoices.map((inv) => (
                    <tr key={inv.id} onClick={() => verInvoice(inv)}>
                      <td><strong>{inv.nroInvoice}</strong></td>
                      {isAdmin && <td>{users[inv.clientId]?.company}</td>}
                      <td style={{ color: "var(--color-text-secondary)" }}>{fmtDate(inv.fecha)}</td>
                      <td><span className="supplier-badge">{inv.cuenta}</span></td>
                      <td>{inv.items.length} artículos</td>
                      <td><strong>{fmtUSD(inv.totalFOB)}</strong></td>
                      <td style={{ fontSize: ".75rem", color: "var(--color-text-secondary)" }}>
                        {inv.desde} → {inv.hasta}
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm btn-icon-only">
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { ArrowLeft, Package, Truck, FileCheck, Clock, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Pedido, STATUS_COLORS } from "@/lib/data";

const fmtUSD = (v: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

const fmtDate = (d: string | null) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) : "—";

interface Props {
  pedido: Pedido;
  onVolver: () => void;
}

function Cheque({ valor }: { valor: boolean | null }) {
  if (valor === true)  return <span className="check-yes"><CheckCircle size={13} /> Sí</span>;
  if (valor === false) return <span className="check-no"><XCircle size={13} /> No</span>;
  return <span className="check-pending"><AlertCircle size={13} /> Pendiente</span>;
}

export default function DetallePedido({ pedido, onVolver }: Props) {
  const colors = STATUS_COLORS[pedido.status] ?? { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" };

  return (
    <div>
      <div className="page-header">
        <button className="back-link" onClick={onVolver}>
          <ArrowLeft size={14} /> Volver a Pedidos
        </button>
        <div className="order-detail-header">
          <div>
            <div className="order-detail-title">{pedido.orderNumber}</div>
            <div className="order-detail-meta">
              <span className="order-meta-item">
                Fecha:&nbsp;<span className="order-meta-value">{fmtDate(pedido.date)}</span>
              </span>
              <span className="order-meta-item">
                Proveedor:&nbsp;<span className="order-meta-value">{pedido.supplier}</span>
              </span>
            </div>
          </div>
          <span className="status-badge" style={{ backgroundColor: colors.bg, color: colors.text }}>
            <span className="status-dot" style={{ backgroundColor: colors.dot }} />
            {pedido.status}
          </span>
        </div>
      </div>

      <div className="page-body">
        {/* Resumen */}
        <div className="detail-grid">
          {/* Pago */}
          <div className="detail-card">
            <div className="detail-card-title"><Package size={14} /> Pago y Condición</div>
            <div className="detail-row">
              <span className="detail-label">Condición</span>
              <span className="detail-value">{pedido.paymentCondition}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Anticipo pagado</span>
              <span className="detail-value"><Cheque valor={pedido.advance.paid} /></span>
            </div>
            {pedido.advance.paid && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Fecha anticipo</span>
                  <span className="detail-value">{fmtDate(pedido.advance.date)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Monto anticipo</span>
                  <span className="detail-value">{pedido.advance.amount ? fmtUSD(pedido.advance.amount) : "—"}</span>
                </div>
              </>
            )}
            <div className="detail-row">
              <span className="detail-label">Saldo pagado</span>
              <span className="detail-value"><Cheque valor={pedido.deposit.paid} /></span>
            </div>
            <div className="detail-row" style={{ borderTop: "2px solid var(--color-border)", marginTop: 8, paddingTop: 12 }}>
              <span className="detail-label" style={{ fontWeight: 600 }}>Total pedido</span>
              <span className="detail-value" style={{ fontSize: "1rem", color: "var(--color-accent)", fontWeight: 700 }}>{fmtUSD(pedido.totalAmount)}</span>
            </div>
          </div>

          {/* Producción */}
          <div className="detail-card">
            <div className="detail-card-title"><Clock size={14} /> Producción</div>
            <div className="detail-row">
              <span className="detail-label">Muestras solicitadas</span>
              <span className="detail-value"><Cheque valor={pedido.production.samplesOrdered} /></span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Aprobación recibida</span>
              <span className="detail-value"><Cheque valor={pedido.production.approvalReceived} /></span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Fin estimado</span>
              <span className="detail-value">{fmtDate(pedido.production.estimatedEnd)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Fin real</span>
              <span className="detail-value">{fmtDate(pedido.production.actualEnd)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total piezas</span>
              <span className="detail-value" style={{ fontWeight: 700 }}>{pedido.totalPcs.toLocaleString("es-AR")}</span>
            </div>
          </div>

          {/* Envío */}
          <div className="detail-card">
            <div className="detail-card-title"><Truck size={14} /> Envío</div>
            <div className="detail-row"><span className="detail-label">Tipo contenedor</span><span className="detail-value">{pedido.shipping.containerType ?? "—"}</span></div>
            <div className="detail-row"><span className="detail-label">Puerto</span><span className="detail-value">{pedido.shipping.port ?? "—"}</span></div>
            <div className="detail-row"><span className="detail-label">CBM</span><span className="detail-value">{pedido.shipping.cbm ?? "—"}</span></div>
            <div className="detail-row"><span className="detail-label">Carga lista</span><span className="detail-value">{fmtDate(pedido.shipping.cargoReady)}</span></div>
            <div className="detail-row"><span className="detail-label">Fecha embarque</span><span className="detail-value">{fmtDate(pedido.shipping.shipmentDate)}</span></div>
            <div className="detail-row"><span className="detail-label">Fecha llegada</span><span className="detail-value">{fmtDate(pedido.shipping.arrivalDate)}</span></div>
            <div className="detail-row"><span className="detail-label">Forwarder confirmado</span><span className="detail-value"><Cheque valor={pedido.shipping.forwarderConfirmed} /></span></div>
            {pedido.shipping.forwarderTracking && (
              <div className="detail-row"><span className="detail-label">Tracking</span><span className="detail-value">{pedido.shipping.forwarderTracking}</span></div>
            )}
          </div>

          {/* Documentación */}
          <div className="detail-card">
            <div className="detail-card-title"><FileCheck size={14} /> Documentación</div>
            <div className="detail-row"><span className="detail-label">Solicitada</span><span className="detail-value"><Cheque valor={pedido.documentation.requested} /></span></div>
            {pedido.documentation.dateRequested && (
              <div className="detail-row"><span className="detail-label">Fecha solicitud</span><span className="detail-value">{fmtDate(pedido.documentation.dateRequested)}</span></div>
            )}
            <div className="detail-row"><span className="detail-label">Factura final</span><span className="detail-value"><Cheque valor={pedido.documentation.finalInvoice} /></span></div>
            <div className="detail-row"><span className="detail-label">Lista de empaque</span><span className="detail-value"><Cheque valor={pedido.documentation.packingList} /></span></div>
            <div className="detail-row"><span className="detail-label">Documentos confirmados</span><span className="detail-value"><Cheque valor={pedido.documentation.documentsConfirmed} /></span></div>
            <div className="detail-row"><span className="detail-label">Documentos entregados</span><span className="detail-value"><Cheque valor={pedido.documentation.documentsDelivered} /></span></div>
          </div>

          {/* Artículos */}
          <div className="detail-card detail-card-full">
            <div className="detail-card-title"><Package size={14} /> Artículos del Pedido</div>
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>ID Artículo</th>
                    <th>Estilo</th>
                    <th>Género</th>
                    <th>Descripción</th>
                    <th>Composición</th>
                    <th>Color</th>
                    <th>Cant.</th>
                    <th>Cant. Final</th>
                    <th>P. Unit.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.items.map((item) => (
                    <tr key={item.itemId} style={{ cursor: "default" }}>
                      <td><code style={{ fontSize: ".75rem" }}>{item.itemId}</code></td>
                      <td><strong>{item.nameStyle}</strong></td>
                      <td>{item.gender}</td>
                      <td>{item.description}</td>
                      <td style={{ fontSize: ".75rem", color: "var(--color-text-secondary)" }}>{item.composition}</td>
                      <td style={{ fontSize: ".8125rem" }}>{item.color}</td>
                      <td>{item.quantity.toLocaleString("es-AR")}</td>
                      <td>{item.finalQuantity !== null ? item.finalQuantity.toLocaleString("es-AR") : <span style={{ color: "var(--color-text-tertiary)" }}>—</span>}</td>
                      <td>{fmtUSD(item.priceCustomer)}</td>
                      <td><strong>{fmtUSD(item.totalCustomer)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline */}
          <div className="detail-card detail-card-full">
            <div className="detail-card-title"><Clock size={14} /> Historial del Pedido</div>
            <div className="timeline">
              {pedido.timeline.map((entry, i) => {
                const isLast = i === pedido.timeline.length - 1;
                const dotClass = isLast ? "actual" : "completado";
                return (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${dotClass}`} />
                    <div className="timeline-date">{fmtDate(entry.date)}</div>
                    <div className="timeline-event">{entry.event}</div>
                    <div className="timeline-detail">{entry.detail}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

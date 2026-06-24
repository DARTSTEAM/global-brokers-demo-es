"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getPedidosCliente, pedidos } from "@/lib/data";

import LoginPage from "@/components/LoginPage";
import Sidebar from "@/components/Sidebar";
import Panel from "@/components/Panel";
import TablaPedidos from "@/components/TablaPedidos";
import DetallePedido from "@/components/DetallePedido";
import VistaClientes from "@/components/VistaClientes";
import VistaProformas from "@/components/VistaProformas";
import VistaEmbarques from "@/components/VistaEmbarques";
import VistaInvoices from "@/components/VistaInvoices";
import CuadroGeneral from "@/components/CuadroGeneral";

type View = "panel" | "pedidos" | "clientes" | "proformas" | "cuadro" | "embarques" | "invoices";

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const [vista, setVista] = useState<View>("panel");
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [filtroCliente, setFiltroCliente] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (!isAuthenticated) return <LoginPage />;

  const isAdmin = user?.role === "admin";
  const misPedidos = isAdmin
    ? filtroCliente
      ? pedidos.filter((p) => p.clientId === filtroCliente)
      : pedidos
    : getPedidosCliente(user!.id);

  const navegar = (v: View) => {
    setVista(v);
    setPedidoId(null);
    setFiltroCliente(null);
    setMenuAbierto(false);
  };

  const verPedido = (id: string) => { setPedidoId(id); setMenuAbierto(false); };
  const volverPedidos = () => setPedidoId(null);

  const verPedidosCliente = (clientId: string) => {
    setFiltroCliente(clientId);
    setVista("pedidos");
  };

  const pedido = pedidoId ? misPedidos.find((p) => p.id === pedidoId) ?? null : null;

  let contenido: React.ReactNode;
  if (pedido && (vista === "pedidos" || vista === "panel" || vista === "embarques")) {
    contenido = <DetallePedido pedido={pedido} onVolver={volverPedidos} />;
  } else if (vista === "panel") {
    contenido = <Panel onVerPedido={verPedido} />;
  } else if (vista === "pedidos") {
    contenido = (
      <div>
        <div className="page-header">
          <div className="page-header-row">
            <div>
              <h1 className="page-title">Pedidos</h1>
              <p className="page-subtitle">
                {filtroCliente ? `Pedidos del cliente seleccionado` : "Todos los pedidos activos"}
              </p>
            </div>
          </div>
        </div>
        <div className="page-body">
          <TablaPedidos
            pedidos={misPedidos}
            onVerPedido={verPedido}
            mostrarCliente={isAdmin && !filtroCliente}
          />
        </div>
      </div>
    );
  } else if (vista === "embarques" && isAdmin) {
    contenido = <VistaEmbarques onVerPedido={verPedido} />;
  } else if (vista === "clientes" && isAdmin) {
    contenido = <VistaClientes onVerCliente={verPedidosCliente} />;
  } else if (vista === "invoices") {
    contenido = <VistaInvoices />;
  } else if (vista === "proformas") {
    contenido = <VistaProformas />;
  } else if (vista === "cuadro" && isAdmin) {
    contenido = <CuadroGeneral />;
  } else {
    contenido = <Panel onVerPedido={verPedido} />;
  }

  return (
    <div className="dashboard-layout">
      {/* Mobile toggle */}
      <button className="mobile-menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)} aria-label="Menú">
        {menuAbierto ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      <div className={`mobile-overlay ${menuAbierto ? "visible" : ""}`} onClick={() => setMenuAbierto(false)} />

      <Sidebar currentView={vista} onNavigate={navegar} isOpen={menuAbierto} />

      <main className="main-content">{contenido}</main>
    </div>
  );
}

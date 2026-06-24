// ─── Usuarios ───────────────────────────────────────────────────────────────

export type UserRole = "admin" | "client";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  company: string;
}

export const users: Record<string, User> = {
  admin: { id: "admin", username: "admin", password: "admin123", role: "admin", name: "Global Brokers", company: "Global Brokers" },
  pgd:   { id: "pgd",   username: "pgd",   password: "pgd2025",  role: "client", name: "Patricia Gonzalez", company: "PGD Indumentaria" },
  eze:   { id: "eze",   username: "eze",   password: "eze2025",  role: "client", name: "Ezequiel Romero",   company: "EZE Textil" },
  mat:   { id: "mat",   username: "mat",   password: "mat2025",  role: "client", name: "Matias Fernandez",  company: "Materia BA" },
  urb:   { id: "urb",   username: "urb",   password: "urb2025",  role: "client", name: "Urbano Team",       company: "URB Clothing" },
};

// ─── Datos de facturación por cliente (CNEE) ─────────────────────────────────

export interface DatosFacturacion {
  cnee: string;
  direccion: string;
  localidadPais: string;
  telefono: string;
  cuit: string;
}

export const datosFacturacion: Record<string, DatosFacturacion> = {
  pgd: {
    cnee: "PGD INDUMENTARIA S.R.L.",
    direccion: "Av. Córdoba 1530 Piso 3, Dpto B",
    localidadPais: "Ciudad Autónoma de Buenos Aires, Argentina",
    telefono: "+54 11 4832-7741",
    cuit: "30-71654892-3",
  },
  eze: {
    cnee: "EZE TEXTIL S.A.",
    direccion: "Gral. José de San Martín 415",
    localidadPais: "Avellaneda, Provincia de Buenos Aires, Argentina",
    telefono: "+54 11 4201-5589",
    cuit: "30-71230456-8",
  },
  mat: {
    cnee: "MATERIA BA S.R.L.",
    direccion: "Aguero 1151 Piso 1, Dpto A",
    localidadPais: "Ciudad Autónoma de Buenos Aires, Argentina",
    telefono: "+54 11 4963-2210",
    cuit: "30-71842925-7",
  },
  urb: {
    cnee: "URB CLOTHING S.A.",
    direccion: "Av. Jujuy 880, Planta Baja",
    localidadPais: "Ciudad Autónoma de Buenos Aires, Argentina",
    telefono: "+54 11 4308-1125",
    cuit: "30-71567834-1",
  },
};

// ─── Invoices ────────────────────────────────────────────────────────────────

export interface ItemInvoice {
  articulo: string;
  cantidad: number;
  unidad: "KG" | "MTS";
  precioUnit: number;
  total: number;
}

export interface Invoice {
  id: string;
  pedidoId: string;
  clientId: string;
  nroInvoice: string;
  fecha: string;
  cuenta: string;
  desde: string;
  hasta: string;
  condicionPago: string;
  items: ItemInvoice[];
  totalCantidad: number;
  totalFOB: number;
}

export const invoices: Invoice[] = [
  {
    id: "inv-001",
    pedidoId: "25001-PGD",
    clientId: "pgd",
    nroInvoice: "26001 PGD",
    fecha: "2026-03-20",
    cuenta: "LN",
    desde: "Shanghái, China",
    hasta: "Buenos Aires, Argentina",
    condicionPago: "30% Anticipo + 70% Antes del Envío",
    items: [
      { articulo: "ART 2661 - ESTAMPADO - 19LSG127-1 100% Poliéster", cantidad: 119, unidad: "KG", precioUnit: 16.58, total: 1973.02 },
      { articulo: "ART 2662 - NEGRO/BORGOÑA/NATURAL - 4249 100% Poliéster", cantidad: 234, unidad: "KG", precioUnit: 13.91, total: 3254.94 },
      { articulo: "ART 2663 - NEGRO/BORGOÑA/NATURAL - 4251 100% Poliéster", cantidad: 254, unidad: "KG", precioUnit: 14.98, total: 3804.92 },
    ],
    totalCantidad: 607,
    totalFOB: 9032.88,
  },
  {
    id: "inv-002",
    pedidoId: "25001-EZE",
    clientId: "eze",
    nroInvoice: "26002 EZE",
    fecha: "2025-09-10",
    cuenta: "BRO",
    desde: "Dhaka, Bangladesh",
    hasta: "Buenos Aires, Argentina",
    condicionPago: "100% Anticipo para Stocks",
    items: [
      { articulo: "ART 2026002 - SURTIDO - CHINO-001 98% Algodón 2% Spandex", cantidad: 600, unidad: "KG", precioUnit: 5.75, total: 3450 },
    ],
    totalCantidad: 600,
    totalFOB: 3450,
  },
];

export function getInvoicesCliente(clientId: string): Invoice[] {
  return invoices.filter((inv) => inv.clientId === clientId);
}

export function getInvoicePorPedido(pedidoId: string): Invoice | undefined {
  return invoices.find((inv) => inv.pedidoId === pedidoId);
}

// ─── Estados de pedidos ──────────────────────────────────────────────────────

export const ESTADO = {
  EN_PRODUCCION: "En Producción",
  CONTROL_CALIDAD: "Control de Calidad",
  EN_TRANSITO: "En Tránsito",
  LLEGADO: "Llegado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
} as const;

export type EstadoPedido = typeof ESTADO[keyof typeof ESTADO];

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Pedido Realizado": { bg: "#FFF7ED", text: "#C2410C", dot: "#EA580C" },
  [ESTADO.EN_PRODUCCION]: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#2563EB" },
  [ESTADO.CONTROL_CALIDAD]: { bg: "#F5F3FF", text: "#6D28D9", dot: "#7C3AED" },
  "Carga Lista": { bg: "#ECFDF5", text: "#047857", dot: "#059669" },
  [ESTADO.EN_TRANSITO]: { bg: "#FEF3C7", text: "#B45309", dot: "#D97706" },
  [ESTADO.LLEGADO]: { bg: "#F0FDF4", text: "#15803D", dot: "#16A34A" },
  [ESTADO.ENTREGADO]: { bg: "#F0FDF4", text: "#15803D", dot: "#16A34A" },
  [ESTADO.CANCELADO]: { bg: "#FEF2F2", text: "#B91C1C", dot: "#DC2626" },
};

// ─── Tipos de pedidos ────────────────────────────────────────────────────────

export interface ItemPedido {
  itemId: string;
  nameStyle: string;
  gender: string;
  description: string;
  composition: string;
  color: string;
  quantity: number;
  finalQuantity: number | null;
  priceCustomer: number;
  totalCustomer: number;
}

export interface TimelineEntry {
  date: string;
  event: string;
  detail: string;
}

export interface Pedido {
  id: string;
  clientId: string;
  orderNumber: string;
  date: string;
  status: EstadoPedido;
  paymentCondition: string;
  supplier: string;
  items: ItemPedido[];
  totalPcs: number;
  totalAmount: number;
  advance: { paid: boolean; date: string | null; amount: number | null };
  deposit: { paid: boolean; amount: number | null };
  production: { samplesOrdered: boolean; approvalReceived: boolean; estimatedEnd: string; actualEnd: string | null };
  shipping: {
    containerType: string | null; port: string | null; cbm: number | null;
    cargoReady: string | null; shipmentDate: string | null; arrivalDate: string | null;
    forwarderConfirmed: boolean; forwarderTracking: string | null;
  };
  documentation: {
    requested: boolean; dateRequested: string | null;
    finalInvoice: boolean; packingList: boolean;
    documentsConfirmed: boolean; documentsDelivered: boolean;
  };
  timeline: TimelineEntry[];
}

// ─── Datos de pedidos ────────────────────────────────────────────────────────

export const pedidos: Pedido[] = [
  {
    id: "25001-PGD", clientId: "pgd", orderNumber: "25001 PGD-P", date: "2025-11-26",
    status: ESTADO.LLEGADO, paymentCondition: "30% Anticipo + 70% Antes del Envío",
    supplier: "Long Sheng",
    items: [
      { itemId: "19LSG127-1", nameStyle: "ART 2661", gender: "Mujer", description: "Blusa de Mujer", composition: "100% Poliéster", color: "Estampado", quantity: 120, finalQuantity: 119, priceCustomer: 16.58, totalCustomer: 1989.6 },
      { itemId: "4249", nameStyle: "ART 2662", gender: "Mujer", description: "Blusa de Mujer", composition: "100% Poliéster", color: "Negro / Borgoña / Natural / Chocolate / Miel", quantity: 240, finalQuantity: 234, priceCustomer: 13.91, totalCustomer: 3338.4 },
      { itemId: "4251", nameStyle: "ART 2663", gender: "Mujer", description: "Blusa de Mujer", composition: "100% Poliéster", color: "Negro / Borgoña / Natural / Chocolate / Miel", quantity: 260, finalQuantity: 254, priceCustomer: 14.98, totalCustomer: 3894.8 },
    ],
    totalPcs: 620, totalAmount: 9222.8,
    advance: { paid: true, date: "2025-11-20", amount: 7500 },
    deposit: { paid: true, amount: 7540 },
    production: { samplesOrdered: true, approvalReceived: true, estimatedEnd: "2026-02-15", actualEnd: "2026-02-10" },
    shipping: { containerType: "LCL", port: "Shanghái, China", cbm: 4.2, cargoReady: "2026-02-12", shipmentDate: "2026-02-20", arrivalDate: "2026-03-25", forwarderConfirmed: true, forwarderTracking: "COSCO2261884" },
    documentation: { requested: true, dateRequested: "2026-02-15", finalInvoice: true, packingList: true, documentsConfirmed: true, documentsDelivered: true },
    timeline: [
      { date: "2025-11-26", event: "Pedido Realizado", detail: "Pedido confirmado con Long Sheng" },
      { date: "2025-11-20", event: "Anticipo Pagado", detail: "Anticipo de USD 7.500 enviado" },
      { date: "2025-12-10", event: "Muestras Solicitadas", detail: "Muestras de producción solicitadas" },
      { date: "2025-12-28", event: "Muestras Aprobadas", detail: "Cliente aprobó las muestras" },
      { date: "2026-01-05", event: "Producción Iniciada", detail: "Fabricación comenzó" },
      { date: "2026-02-10", event: "Producción Completa", detail: "Todos los artículos fabricados" },
      { date: "2026-02-12", event: "Carga Lista", detail: "Mercadería lista para embarque" },
      { date: "2026-02-15", event: "Documentación Enviada", detail: "Factura y lista de empaque enviadas" },
      { date: "2026-02-20", event: "Embarcado", detail: "Partió de Shanghái vía COSCO" },
      { date: "2026-03-25", event: "Llegado", detail: "Contenedor llegó al destino" },
    ],
  },
  {
    id: "25002-PGD", clientId: "pgd", orderNumber: "25002 PGD-P", date: "2025-11-27",
    status: ESTADO.EN_PRODUCCION, paymentCondition: "30% Anticipo + 70% Antes del Envío",
    supplier: "XC Textiles",
    items: [
      { itemId: "STYLE-6A", nameStyle: "ART 2646", gender: "Mujer", description: "Top de Punto", composition: "100% Poliéster", color: "Negro", quantity: 80, finalQuantity: null, priceCustomer: 11.77, totalCustomer: 941.6 },
      { itemId: "STYLE-6B", nameStyle: "ART 2647", gender: "Mujer", description: "Top de Punto", composition: "100% Poliéster", color: "Negro / Borgoña / Nude / Marrón", quantity: 240, finalQuantity: null, priceCustomer: 8.35, totalCustomer: 2003.52 },
      { itemId: "STYLE-7",  nameStyle: "ART 2648", gender: "Mujer", description: "Sweater de Punto", composition: "100% Poliéster", color: "Negro / Borgoña / Nude / Marrón", quantity: 200, finalQuantity: null, priceCustomer: 10.17, totalCustomer: 2033 },
      { itemId: "STYLE-16", nameStyle: "ART 2652", gender: "Mujer", description: "Top Bicolor de Punto", composition: "100% Poliéster", color: "Blanco/Negro / Beige/Marrón / Rojo/Negro", quantity: 240, finalQuantity: null, priceCustomer: 10.27, totalCustomer: 2465.28 },
    ],
    totalPcs: 760, totalAmount: 7443.4,
    advance: { paid: false, date: null, amount: null },
    deposit: { paid: false, amount: null },
    production: { samplesOrdered: true, approvalReceived: true, estimatedEnd: "2026-04-15", actualEnd: null },
    shipping: { containerType: "LCL", port: "Ningbo, China", cbm: null, cargoReady: null, shipmentDate: null, arrivalDate: null, forwarderConfirmed: false, forwarderTracking: null },
    documentation: { requested: false, dateRequested: null, finalInvoice: false, packingList: false, documentsConfirmed: false, documentsDelivered: false },
    timeline: [
      { date: "2025-11-27", event: "Pedido Realizado", detail: "Pedido confirmado con XC Textiles" },
      { date: "2025-12-15", event: "Muestras Solicitadas", detail: "Muestras de producción solicitadas" },
      { date: "2026-01-10", event: "Muestras Aprobadas", detail: "Cliente aprobó las muestras" },
      { date: "2026-01-20", event: "Producción Iniciada", detail: "Fabricación comenzó" },
    ],
  },
  {
    id: "25001-EZE", clientId: "eze", orderNumber: "25001 EZE-P", date: "2025-07-21",
    status: ESTADO.ENTREGADO, paymentCondition: "100% Anticipo para Stocks",
    supplier: "Zoardar",
    items: [
      { itemId: "CHINO-001", nameStyle: "ART 2026002", gender: "Hombre", description: "Pantalón Chino", composition: "98% Algodón 2% Spandex", color: "Surtido", quantity: 600, finalQuantity: 600, priceCustomer: 5.75, totalCustomer: 3450 },
    ],
    totalPcs: 600, totalAmount: 3450,
    advance: { paid: true, date: "2025-07-22", amount: 9540 },
    deposit: { paid: true, amount: 9540 },
    production: { samplesOrdered: true, approvalReceived: true, estimatedEnd: "2025-08-28", actualEnd: "2025-08-25" },
    shipping: { containerType: "LCL", port: "Dhaka, Bangladesh", cbm: 1.5, cargoReady: "2025-08-28", shipmentDate: "2025-09-15", arrivalDate: "2025-10-30", forwarderConfirmed: true, forwarderTracking: "MSC8842190" },
    documentation: { requested: true, dateRequested: "2025-08-07", finalInvoice: true, packingList: true, documentsConfirmed: true, documentsDelivered: true },
    timeline: [
      { date: "2025-07-21", event: "Pedido Realizado", detail: "Pedido confirmado con Zoardar" },
      { date: "2025-07-22", event: "Pago Total", detail: "USD 9.540 anticipo enviado (100% stocks)" },
      { date: "2025-07-28", event: "Muestras Aprobadas", detail: "Cliente aprobó las muestras" },
      { date: "2025-08-01", event: "Producción Iniciada", detail: "Fabricación comenzó" },
      { date: "2025-08-25", event: "Producción Completa", detail: "Todos los artículos listos" },
      { date: "2025-08-28", event: "Carga Lista", detail: "Lista para envío en Dhaka" },
      { date: "2025-09-03", event: "Inspección Aprobada", detail: "Inspección de calidad aprobada" },
      { date: "2025-09-15", event: "Embarcado", detail: "Partió de Dhaka vía MSC" },
      { date: "2025-10-30", event: "Llegado", detail: "Contenedor llegó al destino" },
      { date: "2025-11-05", event: "Entregado", detail: "Mercadería entregada al cliente" },
    ],
  },
  {
    id: "25004-EZE", clientId: "eze", orderNumber: "25004 EZE-P", date: "2025-07-30",
    status: ESTADO.EN_TRANSITO, paymentCondition: "100% Anticipo para Stocks",
    supplier: "Dylan",
    items: [
      { itemId: "JF-YQ.W #706", nameStyle: "Polo Rayas #706", gender: "Hombre", description: "Remera Polo", composition: "65% Algodón 35% Poliéster", color: "Rayas Navy", quantity: 500, finalQuantity: 497, priceCustomer: 3.9, totalCustomer: 1950 },
      { itemId: "JF-YQ.W #716", nameStyle: "Polo Rayas #716", gender: "Hombre", description: "Remera Polo", composition: "65% Algodón 35% Poliéster", color: "Rayas Verde", quantity: 500, finalQuantity: 497, priceCustomer: 3.9, totalCustomer: 1950 },
      { itemId: "JF-YQ.W #732", nameStyle: "Polo Rayas #732", gender: "Hombre", description: "Remera Polo", composition: "65% Algodón 35% Poliéster", color: "Rayas Borgoña", quantity: 500, finalQuantity: 497, priceCustomer: 3.9, totalCustomer: 1950 },
    ],
    totalPcs: 1500, totalAmount: 5850,
    advance: { paid: true, date: "2025-08-04", amount: 1485 },
    deposit: { paid: true, amount: 5850 },
    production: { samplesOrdered: true, approvalReceived: true, estimatedEnd: "2025-08-20", actualEnd: "2025-08-22" },
    shipping: { containerType: "LCL", port: "Fujian, China", cbm: 2, cargoReady: "2025-08-22", shipmentDate: "2026-06-01", arrivalDate: "2026-07-15", forwarderConfirmed: true, forwarderTracking: "EVER7743829" },
    documentation: { requested: true, dateRequested: "2025-08-14", finalInvoice: true, packingList: true, documentsConfirmed: true, documentsDelivered: false },
    timeline: [
      { date: "2025-07-30", event: "Pedido Realizado", detail: "Pedido confirmado con Dylan" },
      { date: "2025-08-04", event: "Anticipo Pagado", detail: "Depósito de USD 1.485 enviado" },
      { date: "2025-08-06", event: "Muestras Aprobadas", detail: "Cliente aprobó los 3 estilos" },
      { date: "2025-08-10", event: "Producción Iniciada", detail: "Fabricación comenzó" },
      { date: "2025-08-22", event: "Producción Completa", detail: "Las 1.500 pzas listas" },
      { date: "2025-08-22", event: "Carga Lista", detail: "Mercadería empaquetada y lista" },
      { date: "2026-06-01", event: "Embarcado", detail: "Partió de Fujian vía Evergreen" },
    ],
  },
  {
    id: "25001-MAT", clientId: "mat", orderNumber: "25001 MAT-P", date: "2025-12-15",
    status: ESTADO.EN_PRODUCCION, paymentCondition: "30% Anticipo + 70% Antes del Envío",
    supplier: "Sara",
    items: [
      { itemId: "TRENCH-001", nameStyle: "Trench Materia", gender: "Mujer", description: "Gabardina", composition: "65% Algodón 35% Poliéster", color: "Beige", quantity: 500, finalQuantity: null, priceCustomer: 17.12, totalCustomer: 8560 },
    ],
    totalPcs: 500, totalAmount: 8560,
    advance: { paid: true, date: "2025-12-20", amount: 2568 },
    deposit: { paid: true, amount: 2568 },
    production: { samplesOrdered: true, approvalReceived: true, estimatedEnd: "2026-07-10", actualEnd: null },
    shipping: { containerType: null, port: null, cbm: null, cargoReady: null, shipmentDate: null, arrivalDate: null, forwarderConfirmed: false, forwarderTracking: null },
    documentation: { requested: false, dateRequested: null, finalInvoice: false, packingList: false, documentsConfirmed: false, documentsDelivered: false },
    timeline: [
      { date: "2025-12-15", event: "Pedido Realizado", detail: "Pedido confirmado con Sara" },
      { date: "2025-12-20", event: "Depósito Pagado", detail: "30% depósito enviado (USD 2.568)" },
      { date: "2026-01-10", event: "Muestras Solicitadas", detail: "Muestras de producción solicitadas" },
      { date: "2026-02-05", event: "Muestras Aprobadas", detail: "Cliente aprobó la muestra de gabardina" },
      { date: "2026-02-15", event: "Producción Iniciada", detail: "Fabricación comenzó" },
    ],
  },
  {
    id: "25002-MAT", clientId: "mat", orderNumber: "25002 MAT-P", date: "2025-12-15",
    status: ESTADO.CONTROL_CALIDAD, paymentCondition: "30% Anticipo + 70% Antes del Envío",
    supplier: "Zoe",
    items: [
      { itemId: "AOT-053-TOB", nameStyle: "Campera Ante Tabaco", gender: "Mujer", description: "Campera de Ante", composition: "100% Poliéster", color: "Tabaco", quantity: 300, finalQuantity: 300, priceCustomer: 15.54, totalCustomer: 4662 },
      { itemId: "AOT-053-GRN", nameStyle: "Campera Ante Verde",  gender: "Mujer", description: "Campera de Ante", composition: "100% Poliéster", color: "Verde",  quantity: 300, finalQuantity: 300, priceCustomer: 15.54, totalCustomer: 4662 },
      { itemId: "AOT-037",     nameStyle: "Campera PU Negra",    gender: "Mujer", description: "Campera de PU",   composition: "100% PU",       color: "Negro",  quantity: 300, finalQuantity: 300, priceCustomer: 19.11, totalCustomer: 5733 },
    ],
    totalPcs: 900, totalAmount: 15057,
    advance: { paid: true, date: "2025-12-22", amount: 4517 },
    deposit: { paid: true, amount: 4517 },
    production: { samplesOrdered: true, approvalReceived: true, estimatedEnd: "2026-06-01", actualEnd: "2026-06-05" },
    shipping: { containerType: "LCL", port: "Guangzhou, China", cbm: 5.8, cargoReady: null, shipmentDate: null, arrivalDate: null, forwarderConfirmed: false, forwarderTracking: null },
    documentation: { requested: false, dateRequested: null, finalInvoice: false, packingList: false, documentsConfirmed: false, documentsDelivered: false },
    timeline: [
      { date: "2025-12-15", event: "Pedido Realizado", detail: "Pedido confirmado con Zoe" },
      { date: "2025-12-22", event: "Depósito Pagado", detail: "30% depósito enviado (USD 4.517)" },
      { date: "2026-01-15", event: "Muestras Aprobadas", detail: "Los 3 estilos de camperas aprobados" },
      { date: "2026-02-01", event: "Producción Iniciada", detail: "Fabricación comenzó" },
      { date: "2026-06-05", event: "Producción Completa", detail: "900 pzas fabricadas" },
      { date: "2026-06-08", event: "Inspección de Calidad", detail: "Inspección tercerizada programada" },
    ],
  },
  {
    id: "25001-URB", clientId: "urb", orderNumber: "25001 URB-P", date: "2025-11-27",
    status: ESTADO.EN_PRODUCCION, paymentCondition: "30% Anticipo + 70% Antes del Envío",
    supplier: "Lin",
    items: [
      { itemId: "URB001", nameStyle: "Campera Inflable Hombre", gender: "Hombre", description: "Campera Inflable con Capucha", composition: "100% Poliéster", color: "Negro", quantity: 1500, finalQuantity: null, priceCustomer: 13.91, totalCustomer: 20865 },
    ],
    totalPcs: 1500, totalAmount: 20865,
    advance: { paid: true, date: "2025-12-04", amount: 6000 },
    deposit: { paid: true, amount: 6000 },
    production: { samplesOrdered: true, approvalReceived: true, estimatedEnd: "2026-06-30", actualEnd: null },
    shipping: { containerType: "FCL 20'", port: "Shanghái, China", cbm: null, cargoReady: null, shipmentDate: null, arrivalDate: null, forwarderConfirmed: false, forwarderTracking: null },
    documentation: { requested: false, dateRequested: null, finalInvoice: false, packingList: false, documentsConfirmed: false, documentsDelivered: false },
    timeline: [
      { date: "2025-11-27", event: "Pedido Realizado", detail: "Pedido confirmado con Lin" },
      { date: "2025-12-04", event: "Depósito Pagado", detail: "30% depósito enviado (USD 6.000)" },
      { date: "2026-01-10", event: "Muestras Aprobadas", detail: "Muestra de campera inflable aprobada" },
      { date: "2026-02-01", event: "Producción Iniciada", detail: "Fabricación de 1.500 unidades comenzó" },
    ],
  },
];

// ─── Funciones helpers ───────────────────────────────────────────────────────

export function getPedidosCliente(clientId: string): Pedido[] {
  return pedidos.filter((p) => p.clientId === clientId);
}

export function getPedidoById(id: string): Pedido | undefined {
  return pedidos.find((p) => p.id === id);
}

export function getStatsGlobales() {
  const total = pedidos.length;
  const activos = pedidos.filter((p) => p.status !== ESTADO.ENTREGADO && p.status !== ESTADO.CANCELADO).length;
  const totalPzas = pedidos.reduce((s, p) => s + p.totalPcs, 0);
  const totalImporte = pedidos.reduce((s, p) => s + p.totalAmount, 0);
  const clientesUnicos = [...new Set(pedidos.map((p) => p.clientId))].length;
  return { total, activos, totalPzas, totalImporte, clientesUnicos };
}

export function getStatsCliente(clientId: string) {
  const lista = getPedidosCliente(clientId);
  const total = lista.length;
  const activos = lista.filter((p) => p.status !== ESTADO.ENTREGADO && p.status !== ESTADO.CANCELADO).length;
  const totalPzas = lista.reduce((s, p) => s + p.totalPcs, 0);
  const totalImporte = lista.reduce((s, p) => s + p.totalAmount, 0);
  const enTransito = lista.filter((p) => p.status === ESTADO.EN_TRANSITO).length;
  return { total, activos, totalPzas, totalImporte, enTransito };
}

// ─── Cuadro General ──────────────────────────────────────────────────────────

export const CUADRO_STATUS = {
  EN_PRODUCCION: "En Producción",
  LISTA: "Lista",
  ESPERANDO_LABDIPS: "Esperando LABDIPS",
  SALDADA: "Saldada",
  CANCELADA: "Cancelada",
  ARRIBADA: "Arribada",
  PENDING: "Pending",
  STAND_BY: "STAND BY",
  EMBARCADO: "Embarcado",
} as const;

export const CUADRO_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  [CUADRO_STATUS.EN_PRODUCCION]:     { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  [CUADRO_STATUS.LISTA]:             { bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
  [CUADRO_STATUS.ESPERANDO_LABDIPS]: { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
  [CUADRO_STATUS.SALDADA]:           { bg: "#E0E7FF", text: "#3730A3", dot: "#6366F1" },
  [CUADRO_STATUS.CANCELADA]:         { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
  [CUADRO_STATUS.ARRIBADA]:          { bg: "#D1FAE5", text: "#065F46", dot: "#059669" },
  [CUADRO_STATUS.PENDING]:           { bg: "#FEF9C3", text: "#854D0E", dot: "#EAB308" },
  [CUADRO_STATUS.STAND_BY]:          { bg: "#FFF7ED", text: "#9A3412", dot: "#FB923C" },
  [CUADRO_STATUS.EMBARCADO]:         { bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6" },
};

export interface FilaCuadro {
  id: string;
  customer: string;
  subcustomer: string;
  supplierId: string;
  status: string;
  item: string;
  commercialName: string;
  vendedor: string;
  mes: string;
  mesNumero: number | null;
  ano?: number;
  temporada: string;
  cuenta: string;
  seguimiento: string;
  puerto: string;
  driveLink?: string;
}

export const cuadroGeneral: FilaCuadro[] = [
  { id: "cg1",  customer: "CCT", subcustomer: "SHIN-L",  supplierId: "COLO", status: CUADRO_STATUS.EN_PRODUCCION,     item: "100% POLYESTER, 350GSM 150CM",                                                   commercialName: "Paño de Punto",          vendedor: "Lucas",    mes: "Abr", mesNumero: 4,    temporada: "Atemporal",         cuenta: "LN",       seguimiento: "",         puerto: "Yantian, China",  driveLink: "https://drive.google.com" },
  { id: "cg2",  customer: "ABC", subcustomer: "JMY-R",   supplierId: "CD",   status: CUADRO_STATUS.LISTA,             item: "100% POLYESTER, 150CM, 230G/M",                                                  commercialName: "Minimat 300",            vendedor: "Agustin",  mes: "Mar", mesNumero: 3,    temporada: "Hogar",             cuenta: "SHENGTEX", seguimiento: "Luciana",  puerto: "" },
  { id: "cg3",  customer: "FUL", subcustomer: "SHIN-M",  supplierId: "DBT",  status: CUADRO_STATUS.ESPERANDO_LABDIPS, item: "GERMANY VELVET P/D, 280GSM 160CM",                                               commercialName: "Darlon Solid",           vendedor: "Victory",  mes: "May", mesNumero: 5,    temporada: "Producto Terminado", cuenta: "TESSITURA", seguimiento: "Luz",      puerto: "Shekou, China" },
  { id: "cg4",  customer: "SOU", subcustomer: "SHIN-M",  supplierId: "BL",   status: CUADRO_STATUS.PENDING,           item: "97% RAYON 3% SPANDEX, 145CM, 160GSM 21S X21S/70DSP",                             commercialName: "Bengalina",              vendedor: "Lautaro",  mes: "Feb", mesNumero: 2,  ano: 2025, temporada: "Invierno",          cuenta: "BRO",      seguimiento: "Marina",   puerto: "Shanghái, China" },
  { id: "cg5",  customer: "URB", subcustomer: "COP-M",   supplierId: "FEM",  status: CUADRO_STATUS.ARRIBADA,          item: "260GSM × 160CM SOFT VELVET",                                                     commercialName: "Plush Simple",           vendedor: "Camila",   mes: "Jul", mesNumero: 7,    temporada: "",                  cuenta: "",         seguimiento: "Micaela",  puerto: "Qingdao, China" },
  { id: "cg6",  customer: "FED", subcustomer: "",        supplierId: "EVE",  status: CUADRO_STATUS.SALDADA,           item: "GERMANY VELVET MELANGE, 280GSM 160CM",                                           commercialName: "Darlon Jersey Melange",  vendedor: "Agustina", mes: "Jun", mesNumero: 6,    temporada: "",                  cuenta: "",         seguimiento: "",         puerto: "Xingang, China" },
  { id: "cg7",  customer: "ADA", subcustomer: "CCT-A",   supplierId: "FLS",  status: CUADRO_STATUS.CANCELADA,         item: "260GSM × 160CM SUPER SOFT",                                                      commercialName: "Plush Doble",            vendedor: "",         mes: "Ago", mesNumero: 8,    temporada: "",                  cuenta: "",         seguimiento: "",         puerto: "" },
  { id: "cg8",  customer: "MAR", subcustomer: "",        supplierId: "RI",   status: CUADRO_STATUS.EN_PRODUCCION,     item: "BEDSHEET PD LW-02 NORMAL HANDFEEL - 100 POLY; 70GSM; 240CM",                     commercialName: "Sábana 120",             vendedor: "",         mes: "",    mesNumero: null, temporada: "",                  cuenta: "",         seguimiento: "",         puerto: "" },
  { id: "cg9",  customer: "LAB", subcustomer: "CCT-M",   supplierId: "GRE",  status: CUADRO_STATUS.LISTA,             item: "BL023-234 96% P 4%SPX 150CM 190GSM",                                             commercialName: "Barbie",                 vendedor: "",         mes: "Oct", mesNumero: 10,   temporada: "",                  cuenta: "",         seguimiento: "",         puerto: "" },
  { id: "cg10", customer: "MAL", subcustomer: "SEVEN-D", supplierId: "GV",   status: CUADRO_STATUS.EN_PRODUCCION,     item: "INTERLOCK 100%POLY, 150CM, 130GSM - ITEM: 0870",                                 commercialName: "Interlock Color",        vendedor: "",         mes: "Nov", mesNumero: 11,   temporada: "",                  cuenta: "",         seguimiento: "",         puerto: "" },
  { id: "cg11", customer: "Todos", subcustomer: "",      supplierId: "AL",   status: CUADRO_STATUS.EMBARCADO,         item: "74%R 23%N 3%SP, 240GSM, 57/58''",                                                commercialName: "Todos",                  vendedor: "Todos",    mes: "Ene", mesNumero: 1,  ano: 2024, temporada: "Verano",            cuenta: "LN",       seguimiento: "Agustina", puerto: "Ningbo, China" },
  { id: "cg12", customer: "ADN", subcustomer: "",        supplierId: "JAD",  status: CUADRO_STATUS.STAND_BY,          item: "FLS082 PRINTMORLEY POLY SPANDEX PRINT 95%POLY 5% SPANDEX 150CMX200G/SM",         commercialName: "Modal Soft",             vendedor: "",         mes: "",    mesNumero: null, ano: 2026, temporada: "",                  cuenta: "",         seguimiento: "",         puerto: "" },
];

export function getStatsCuadro() {
  const total = cuadroGeneral.length;
  const byStatus: Record<string, number> = {};
  cuadroGeneral.forEach((f) => { byStatus[f.status] = (byStatus[f.status] || 0) + 1; });
  const clientesUnicos = [...new Set(cuadroGeneral.map((f) => f.customer))].length;
  const proveedoresUnicos = [...new Set(cuadroGeneral.map((f) => f.supplierId))].length;
  return { total, byStatus, clientesUnicos, proveedoresUnicos };
}

// ─── Catálogo de telas ───────────────────────────────────────────────────────

export const catalogoTelas = [
  { id: "fc1",  commercialName: "Paño de Punto",    composition: "100% Poliéster, 350GSM, 150CM" },
  { id: "fc2",  commercialName: "Minimat 300",       composition: "100% Poliéster, 150CM, 230G/M" },
  { id: "fc3",  commercialName: "Darlon Solid",      composition: "Germany Velvet P/D, 280GSM, 160CM" },
  { id: "fc4",  commercialName: "Barbie",            composition: "96% Poly 4% SPX, 150CM, 190GSM" },
  { id: "fc5",  commercialName: "Bengalina",         composition: "74%R 23%N 3%SP, 240GSM, 57/58''" },
  { id: "fc6",  commercialName: "Plush Simple",      composition: "260GSM × 160CM, Soft Velvet" },
  { id: "fc7",  commercialName: "Plush Doble",       composition: "260GSM × 160CM, Super Soft" },
  { id: "fc8",  commercialName: "Interlock Color",   composition: "100% Poly, 150CM, 130GSM" },
  { id: "fc9",  commercialName: "Stella",            composition: "95% Poly 5% SPX, 160CM, 240GSM" },
  { id: "fc10", commercialName: "Morley Soft",       composition: "95% Poly 5% SPX, 160CM, 170GSM" },
  { id: "fc11", commercialName: "Modal Soft",        composition: "97% Poly 3% SPX, 160CM, 170GSM" },
  { id: "fc12", commercialName: "Scuba Crepe",       composition: "96% Poly 4% SPX, 150CM, 250-260GSM" },
  { id: "fc13", commercialName: "Rayon Poplin",      composition: "100% Rayón, 142CM, 110GSM" },
  { id: "fc14", commercialName: "Sherpa Doble",      composition: "100% Poly, 160CM, 330-340GSM" },
  { id: "fc15", commercialName: "Cuerina",           composition: "60% PU 40% Poly, 140CM, 200GSM" },
  { id: "fc16", commercialName: "Flannel",           composition: "100% Poly, 160CM, 280GSM" },
  { id: "fc17", commercialName: "Polar Premium",     composition: "100% Poly, 160CM, 260GSM" },
  { id: "fc18", commercialName: "Novasonic",         composition: "88% Nylon 12% SPX, 145CM, 150GSM" },
  { id: "fc19", commercialName: "Lena",              composition: "92% Rayón 8% Poly, 143CM, 185GSM" },
  { id: "fc20", commercialName: "Cotton Poplin SPX", composition: "97% Algodón 3% SPX, 150CM, 110GSM" },
];

// ─── Listas de referencia ─────────────────────────────────────────────────────

export const puertos = ["Yantian, China", "Shekou, China", "Shanghái, China", "Ningbo, China", "Qingdao, China", "Tianjin, China", "Xingang, China"];
export const vendedores = ["Lucas", "Agustin", "Victory", "Camila", "Lautaro", "Agustina", "Marina", "Micaela", "Luz"];
export const temporadas = ["Invierno", "Verano", "Atemporal", "Hogar", "Producto Terminado"];
export const proveedores = [
  { id: "COLO", name: "Paño de Punto" }, { id: "CD", name: "Minimat 300" },
  { id: "DBT", name: "Darlon Solid" },   { id: "MSN", name: "Cotton Poplin SPX" },
  { id: "GRE", name: "Barbie" },         { id: "FEM", name: "Plush Simple" },
  { id: "BL", name: "Bengalina" },       { id: "AL", name: "Todos" },
  { id: "GV", name: "Interlock Color" }, { id: "EVE", name: "Darlon Jersey Melange" },
  { id: "FLS", name: "Plush Doble" },    { id: "ITT", name: "Rib Velvet" },
  { id: "STX", name: "Soft Shell" },     { id: "RI", name: "Sábana 120" },
  { id: "SHI", name: "Sábana 70 Print" },
];

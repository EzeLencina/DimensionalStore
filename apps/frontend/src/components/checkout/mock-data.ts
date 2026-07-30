export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
};

export type CheckoutAddress = {
  country: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
  number: string;
  floor: string;
  apartment: string;
  reference: string;
};

export type CheckoutShippingMethod = {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  provider: string;
};

export type CheckoutPaymentMethod = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type CheckoutStepId = 'customer' | 'address' | 'shipping' | 'payment' | 'confirmation';

export const provinces: { name: string; cities: string[] }[] = [
  { name: 'Buenos Aires', cities: ['La Plata', 'Mar del Plata', 'Bahía Blanca', 'Tandil', 'San Nicolás'] },
  { name: 'CABA', cities: ['Palermo', 'Belgrano', 'Recoleta', 'Nuñez', 'Caballito'] },
  { name: 'Córdoba', cities: ['Córdoba Capital', 'Villa María', 'Río Cuarto', 'Carlos Paz'] },
  { name: 'Santa Fe', cities: ['Rosario', 'Santa Fe Capital', 'Rafaela', 'Venado Tuerto'] },
  { name: 'Mendoza', cities: ['Mendoza Capital', 'Godoy Cruz', 'San Rafael', 'Maipú'] },
];

export const shippingMethods: CheckoutShippingMethod[] = [
  { id: 'std', name: 'Envío estándar', description: 'Entrega en domicilio por correo oficial', price: 0, estimatedDays: '5-7 días hábiles', provider: 'Correo Argentino' },
  { id: 'exp', name: 'Envío express', description: 'Entrega rápida con seguimiento en tiempo real', price: 7500, estimatedDays: '1-3 días hábiles', provider: 'OCA' },
  { id: 'priority', name: 'Entrega programada', description: 'Elegí el día y la franja horaria de entrega', price: 15000, estimatedDays: '24-48 horas', provider: 'Andreani' },
  { id: 'pickup', name: 'Retiro en sucursal', description: 'Retirás sin costo en nuestra sucursal más cercana', price: 0, estimatedDays: 'Disponible en 2 horas', provider: 'Sucursal Tienda' },
];

export const paymentMethods: CheckoutPaymentMethod[] = [
  { id: 'credit_card', name: 'Tarjeta de crédito', description: 'Hasta 12 cuotas sin interés', icon: 'credit-card' },
  { id: 'debit_card', name: 'Tarjeta de débito', description: 'Débito inmediato', icon: 'debit-card' },
  { id: 'mercadopago', name: 'Mercado Pago', description: 'Pagá con tu billetera virtual o tarjetas guardadas', icon: 'mercadopago' },
  { id: 'modo', name: 'MODO', description: 'Pagá desde tu app MODO en segundos', icon: 'modo' },
  { id: 'bank_transfer', name: 'Transferencia bancaria', description: '10% de descuento por transferencia', icon: 'bank' },
];

export const mockCustomer: CheckoutCustomer = {
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan@ejemplo.com',
  phone: '1155551234',
  documentType: 'DNI',
  documentNumber: '30123456',
};

export const mockAddress: CheckoutAddress = {
  country: 'Argentina',
  province: 'Buenos Aires',
  city: 'La Plata',
  postalCode: '1900',
  street: 'Av. 7',
  number: '1234',
  floor: '3',
  apartment: 'B',
  reference: 'Edificio blanco, timbre 3',
};

export const mockOrderNumber = 'ORD-2026-0004582';

export const checkoutSteps: { id: CheckoutStepId; label: string; shortLabel: string }[] = [
  { id: 'customer', label: 'Información del cliente', shortLabel: 'Cliente' },
  { id: 'address', label: 'Dirección de entrega', shortLabel: 'Entrega' },
  { id: 'shipping', label: 'Método de envío', shortLabel: 'Envío' },
  { id: 'payment', label: 'Método de pago', shortLabel: 'Pago' },
  { id: 'confirmation', label: 'Confirmación', shortLabel: 'Confirmar' },
];

export const cardBrands: { pattern: RegExp; name: string }[] = [
  { pattern: /^4/, name: 'Visa' },
  { pattern: /^5[1-5]/, name: 'Mastercard' },
  { pattern: /^34|^37/, name: 'American Express' },
  { pattern: /^6(?:011|5)/, name: 'Discover' },
  { pattern: /^3(?:0[0-5]|[68])/, name: 'Diners Club' },
];

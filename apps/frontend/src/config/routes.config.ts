export const routesConfig = {
  public: {
    home: '/',
    products: '/productos',
    productDetail: (slug: string) => `/productos/${slug}`,
    cart: '/carrito',
    checkout: '/checkout',
    contact: '/contacto',
    about: '/nosotros',
  },
  admin: {
    dashboard: '/admin',
    products: '/admin/productos',
    orders: '/admin/pedidos',
    customers: '/admin/clientes',
    inventory: '/admin/inventario',
    finance: '/admin/finanzas',
    settings: '/admin/configuracion',
  },
  vendor: {
    dashboard: '/vendedor',
    products: '/vendedor/productos',
    orders: '/vendedor/pedidos',
    commissions: '/vendedor/comisiones',
  },
  auth: {
    login: '/ingresar',
    register: '/registrarse',
    forgotPassword: '/recuperar-contrasena',
    resetPassword: '/restablecer-contrasena',
  },
} as const;

# Layout — Tree Structure

```
RootLayout (app/layout.tsx)
├── ThemeProvider
│   ├── QueryProvider
│   │   ├── ModalProvider
│   │   │   ├── (public)/layout.tsx
│   │   │   │   └── MainLayout
│   │   │   │       ├── SkipToContent
│   │   │   │       ├── Header
│   │   │   │       │   ├── AnnouncementBar
│   │   │   │       │   ├── TopBar
│   │   │   │       │   │   ├── CurrencySelector
│   │   │   │       │   │   └── LanguageSelector
│   │   │   │       │   ├── Container
│   │   │   │       │   │   ├── Logo
│   │   │   │       │   │   ├── SearchBar (desktop)
│   │   │   │       │   │   ├── NavLinks (ofertas, novedades)
│   │   │   │       │   │   ├── IconGroup
│   │   │   │       │   │   │   ├── User
│   │   │   │       │   │   │   ├── Favorites
│   │   │   │       │   │   │   ├── Comparer
│   │   │   │       │   │   │   ├── ThemeToggle
│   │   │   │       │   │   │   └── Cart
│   │   │   │       │   │   └── MegaMenu
│   │   │   │       │   └── SearchBar (mobile)
│   │   │   │       ├── <main>
│   │   │   │       │   └── Page Content
│   │   │   │       └── Footer
│   │   │   │           ├── Newsletter
│   │   │   │           ├── FooterSections (4 columns)
│   │   │   │           ├── PaymentMethods
│   │   │   │           ├── ShippingMethods
│   │   │   │           ├── SocialLinks
│   │   │   │           └── Copyright
│   │   │   └── ToastProvider
│   │   └── (admin)/layout.tsx
│   └── (auth)/layout.tsx
└── Body
```

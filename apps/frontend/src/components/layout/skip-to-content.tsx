export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={[
        'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]',
        'focus:inline-flex focus:items-center focus:gap-2',
        'focus:rounded-lg focus:bg-background focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium',
        'focus:shadow-lg focus:ring-2 focus:ring-ring focus:outline-none',
      ].join(' ')}
    >
      Saltar al contenido principal
    </a>
  );
}

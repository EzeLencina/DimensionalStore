import { Store, Heart, Truck, CreditCard, ShieldCheck, Headphones, ChevronDown } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Container } from '../containers/container';
import { Newsletter } from '../newsletter/newsletter';
import { footerSections, socialLinks, paymentMethods, shippingMethods } from '@lib/layout/navigation';

export type FooterProps = {
  className?: string;
  showNewsletter?: boolean;
};

export function Footer({ className, showNewsletter = true }: FooterProps) {
  return (
    <footer className={cn('border-t border-border bg-background', className)}>
      {showNewsletter && (
        <Newsletter
          variant="default"
          className="border-b border-border"
        />
      )}

      <Container size="xl">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {footerSections.map((section) => (
              <div key={section.id}>
                <h3 className="text-sm font-semibold text-foreground mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container size="xl">
          <div className="py-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Medios de pago
                </h4>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => (
                    <span
                      key={method.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      {method.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Medios de envío
                </h4>
                <div className="flex flex-wrap gap-2">
                  {shippingMethods.map((method) => (
                    <span
                      key={method.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      {method.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Seguinos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-muted/50 p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={link.name}
                    >
                      <span className="text-xs font-medium">{link.name.slice(0, 2)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
              <a href="/" className="flex items-center gap-2" aria-label="Tienda - Home">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                  <Store className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-bold">Tienda</span>
              </a>

              <p className="text-xs text-muted-foreground text-center sm:text-left">
                &copy; {new Date().getFullYear()} Tienda. Todos los derechos reservados. |{' '}
                <a href="/terminos" className="hover:text-foreground transition-colors">Términos</a>
                {' | '}
                <a href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</a>
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

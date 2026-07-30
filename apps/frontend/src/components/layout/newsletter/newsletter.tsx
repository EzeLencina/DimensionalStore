'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Container } from '../containers/container';

type NewsletterState = 'idle' | 'loading' | 'success' | 'error';

export type NewsletterProps = {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'muted' | 'primary';
};

export function Newsletter({
  title = 'Newsletter',
  description = 'Recib\u00ed las mejores ofertas y novedades en tu correo.',
  placeholder = 'tu@email.com',
  buttonText = 'Suscribirme',
  className,
  variant = 'default',
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<NewsletterState>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setState('loading');
    setTimeout(() => {
      setState('success');
      setEmail('');
    }, 1500);
  };

  const bgClass = variant === 'primary' ? 'bg-primary text-primary-foreground' :
    variant === 'muted' ? 'bg-muted/50' : 'bg-background';

  return (
    <section className={cn('py-12 sm:py-16', bgClass, className)} aria-label={title}>
      <Container size="lg">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <Mail className={cn('h-6 w-6', variant === 'primary' ? 'text-primary-foreground' : 'text-primary')} />
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          <p className={cn('mt-2 text-sm sm:text-base', variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
            {description}
          </p>

          {state === 'success' ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span>¡Suscripción exitosa! Revisá tu correo.</span>
            </div>
          ) : state === 'error' ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-destructive" role="alert" aria-live="polite">
              <AlertCircle className="h-5 w-5" />
              <span>Ocurrió un error. Intentalo de nuevo.</span>
              <button
                type="button"
                onClick={() => setState('idle')}
                className="underline underline-offset-2 hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" aria-busy={state === 'loading' ? 'true' : undefined}>
              <label htmlFor="newsletter-email" className="sr-only">Email</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                required
                className={cn(
                  'flex h-11 w-full rounded-xl border bg-background px-4 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'border-input hover:border-foreground/20',
                  'transition-colors duration-200',
                  variant === 'primary' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/60' : '',
                )}
                disabled={state === 'loading'}
              />
              <button
                type="submit"
                disabled={state === 'loading'}
                className={cn(
                  'inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-medium',
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  'transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  variant === 'primary' ? 'bg-white text-primary hover:bg-white/90' : '',
                )}
              >
                {state === 'loading' ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <>
                    {buttonText}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { Truck, CreditCard, ShieldCheck, Headphones, Tag, ChevronDown } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { topBarConfig } from '@lib/layout/navigation';
import { Container } from '../containers/container';

type TopBarProps = {
  className?: string;
  hidden?: boolean;
};

export function TopBar({ className, hidden = false }: TopBarProps) {
  if (hidden) return null;

  const items = [
    { icon: Truck, text: topBarConfig.shipping },
    { icon: CreditCard, text: topBarConfig.installments },
    { icon: ShieldCheck, text: topBarConfig.warranty },
    { icon: Headphones, text: topBarConfig.support },
    { icon: Tag, text: topBarConfig.promotions },
  ];

  return (
    <div
      className={cn(
        'hidden md:block border-b border-border bg-muted/30 text-xs text-muted-foreground',
        className,
      )}
    >
      <Container size="xl">
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-4 lg:gap-6">
            {items.map((item) => (
              <span key={item.text} className="inline-flex items-center gap-1.5">
                <item.icon className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">{item.text}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <CurrencySelector />
            <LanguageSelector />
          </div>
        </div>
      </Container>
    </div>
  );
}

function CurrencySelector() {
  const [currency, setCurrency] = useState('ARS');
  const [open, setOpen] = useState(false);

  const currencies = [
    { code: 'ARS', symbol: '$', name: 'Peso Argentino' },
    { code: 'USD', symbol: 'US$', name: 'Dólar' },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="font-medium">{currency === 'ARS' ? '$' : 'US$'} {currency}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[160px] rounded-lg border border-border bg-popover p-1 shadow-lg z-50 animate-in fade-in-0 slide-in-from-top-1"
          role="listbox"
        >
          {currencies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => { setCurrency(c.code); setOpen(false); }}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                currency === c.code ? 'bg-accent text-accent-foreground' : 'hover:bg-accent',
              )}
              role="option"
              aria-selected={currency === c.code}
            >
              <span className="font-medium">{c.symbol}</span>
              <span className="text-muted-foreground">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LanguageSelector() {
  const [lang, setLang] = useState('es');
  const [open, setOpen] = useState(false);

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="font-medium uppercase">{lang}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[140px] rounded-lg border border-border bg-popover p-1 shadow-lg z-50 animate-in fade-in-0 slide-in-from-top-1"
          role="listbox"
        >
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                lang === l.code ? 'bg-accent text-accent-foreground' : 'hover:bg-accent',
              )}
              role="option"
              aria-selected={lang === l.code}
            >
              <span className={cn(lang === l.code && 'font-medium')}>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

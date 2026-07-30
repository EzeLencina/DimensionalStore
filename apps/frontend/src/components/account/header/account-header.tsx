'use client';

import { Menu, Bell, User } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { accountUser } from '../mock-data';

type AccountHeaderProps = {
  onMenuToggle: () => void;
  className?: string;
};

export function AccountHeader({ onMenuToggle, className }: AccountHeaderProps) {
  return (
    <header className={cn('flex items-center justify-between mb-6', className)}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden rounded-lg p-2 hover:bg-accent transition-colors"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Hola, {accountUser.firstName}</p>
            <p className="text-xs text-muted-foreground">{accountUser.email}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="relative rounded-lg p-2 hover:bg-accent transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
      </button>
    </header>
  );
}

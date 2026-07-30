'use client';

import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import type { AnnoucementConfig } from '@lib/layout/navigation';

type AnnouncementBarProps = {
  config: AnnoucementConfig;
  className?: string;
  defaultVisible?: boolean;
};

export function AnnouncementBar({ config, className, defaultVisible = true }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(defaultVisible);

  if (!visible || !config.text) return null;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm',
        className,
      )}
      role="banner"
      aria-label="Announcement"
    >
      <span className="truncate max-w-[90%] sm:max-w-none">{config.text}</span>
      {config.href && config.cta && (
        <a
          href={config.href}
          className="hidden sm:inline-flex items-center gap-1 whitespace-nowrap font-semibold underline underline-offset-2 hover:no-underline"
        >
          {config.cta}
          <ArrowRight className="h-3 w-3" />
        </a>
      )}
      {config.dismissible && (
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-2 opacity-80 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

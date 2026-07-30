'use client';

import { useState } from 'react';
import { Section, Container } from '@components/layout';
import { AccountSidebar, AccountHeader } from '@components/account';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Section spacing="md" className="min-h-screen">
      <Container>
        <div className="flex gap-6 lg:gap-8">
          <AccountSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="flex-1 min-w-0">
            <AccountHeader onMenuToggle={() => setSidebarOpen(true)} />
            {children}
          </main>
        </div>
      </Container>
    </Section>
  );
}

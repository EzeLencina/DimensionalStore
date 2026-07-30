import type { Metadata } from 'next';
import { Gift } from 'lucide-react';
import { AccountEmptyState } from '@components/account';

export const metadata: Metadata = {
  title: 'Lista de deseos — Tienda',
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <AccountEmptyState
      icon={Gift}
      title="Lista de deseos"
      description="Creá tu lista de deseos para compartir con amigos y familiares. Próximamente disponible."
    />
  );
}

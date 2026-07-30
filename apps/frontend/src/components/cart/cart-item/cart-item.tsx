'use client';

import { useState } from 'react';
import { Trash2, Heart, Bookmark, Minus, Plus } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { formatPrice, Badge } from '@tienda/ui';
import type { CartItem as CartItemType } from '../mock-data';

type CartItemProps = {
  item: CartItemType;
  className?: string;
};

export function CartItem({ item, className }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const subtotal = item.price * quantity;

  const handleQuantityChange = (val: number) => {
    setQuantity(Math.max(1, Math.min(val, item.maxQuantity)));
  };

  return (
    <div
      className={cn(
        'flex gap-3 sm:gap-4 py-4 sm:py-5 border-b border-border last:border-b-0',
        !item.inStock && 'opacity-60',
        className,
      )}
      role="group"
      aria-label={`Producto: ${item.name}`}
    >
      <div className="relative shrink-0 w-20 sm:w-24 aspect-square rounded-lg bg-muted overflow-hidden">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" draggable={false} />
        {item.badge && (
          <div className="absolute top-1 left-1">
            <Badge variant={item.badgeVariant ?? 'default'} size="sm">{item.badge}</Badge>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <a href={`/producto/${item.slug}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
              {item.name}
            </a>
            <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
            <p className="text-xs text-muted-foreground">{item.brand}</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Eliminar ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {item.variantLabel && item.variantValue && (
          <p className="text-xs text-muted-foreground">
            {item.variantLabel}: <span className="text-foreground">{item.variantValue}</span>
          </p>
        )}

        <div className="flex items-center gap-2 text-xs">
          {item.inStock ? (
            <span className={cn(
              'font-medium',
              item.stockCount <= 5 ? 'text-warning' : 'text-success',
            )}>
              {item.stockCount <= 5 ? `Solo ${item.stockCount} restantes` : 'En stock'}
            </span>
          ) : (
            <span className="text-destructive font-medium">Sin stock</span>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="p-1.5 hover:bg-accent transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-l-lg"
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-3 w-3" />
            </button>
            <input
              type="number"
              value={quantity}
              min={1}
              max={item.maxQuantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-10 text-center text-sm font-medium bg-transparent border-x border-border [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus-visible:outline-none"
              aria-label={`Cantidad de ${item.name}`}
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= item.maxQuantity}
              className="p-1.5 hover:bg-accent transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-r-lg"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-auto text-right">
            {item.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(item.originalPrice * quantity)}
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-foreground tabular-nums">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Guardar ${item.name} para después`}
          >
            <Bookmark className="h-3 w-3" />
            Guardar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Mover ${item.name} a favoritos`}
          >
            <Heart className="h-3 w-3" />
            Favoritos
          </button>
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
export type ColorScheme = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export type AsChildProps = {
  asChild?: boolean;
};

export type PolymorphicProps<C extends React.ElementType> = {
  as?: C;
} & React.ComponentPropsWithoutRef<C>;

export type ChildrenProps = {
  children: ReactNode;
};

export type ClassNameProps = {
  className?: string;
};

export type TestIdProps = {
  'data-testid'?: string;
};

export type BaseProps = ChildrenProps & ClassNameProps & TestIdProps;

export type StrictProps<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};

export type Orientation = 'horizontal' | 'vertical';

export type Direction = 'ltr' | 'rtl';

export type Alignment = 'start' | 'center' | 'end';

export type Side = 'top' | 'right' | 'bottom' | 'left';

export type SideOffset = number;

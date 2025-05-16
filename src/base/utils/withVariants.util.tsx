/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VariantProps, cva } from 'class-variance-authority';
import React, { ComponentProps } from 'react';

import { cn } from '@/base/lib';

/**
 * Set default `className` with `cn` and `variants`.
 *
 * @param Component - The component to which props will be added.
 * @param variants - Variants from `cva`. `Component` props will be extended
 *   with `variants` props.
 * @param onlyVariantsProps - Props to exclude from `Component`. Set the props
 *   that are only used for variants.
 */
export function withVariants<T extends React.ElementType, V extends ReturnType<typeof cva>>(
  Component: T,
  variants: V,
  onlyVariantsProps?: (keyof VariantProps<V>)[],
) {
  return function ExtendComponent(props: ComponentProps<T> & VariantProps<V>) {
    const { className, ...rest } = props;
    const variantProps = { ...rest } as VariantProps<V>;
    const componentProps = { ...rest } as any;

    if (onlyVariantsProps) {
      onlyVariantsProps.forEach((key) => {
        if (key in componentProps) {
          delete componentProps[key as string];
        }
      });
    }

    return <Component className={cn(variants(variantProps), className)} {...componentProps} />;
  };
}

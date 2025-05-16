'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/base/lib';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

type TooltipProps<T extends React.ElementType> = {
  delayDuration?: number;
  disableHoverableContent?: boolean;
  skipDelayDuration?: number;
  tooltip?: React.ReactNode;
  tooltipContentProps?: Omit<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    'children'
  >;
  tooltipProps?: Omit<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>, 'children'>;
  tooltipTriggerProps?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;
} & React.ComponentProps<T>;

function withTooltip<T extends React.ElementType>(Component: T) {
  return function ExtendComponent({
    delayDuration = 0,
    disableHoverableContent = true,
    skipDelayDuration = 0,
    tooltip,
    tooltipContentProps,
    tooltipProps,
    tooltipTriggerProps,
    ...props
  }: TooltipProps<T>) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const component = <Component {...(props as React.ComponentProps<T>)} />;

    if (tooltip && mounted) {
      return (
        <TooltipProvider
          delayDuration={delayDuration}
          disableHoverableContent={disableHoverableContent}
          skipDelayDuration={skipDelayDuration}
        >
          <Tooltip {...tooltipProps}>
            <TooltipTrigger asChild {...tooltipTriggerProps}>
              {component}
            </TooltipTrigger>
            <TooltipContent {...tooltipContentProps}>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return component;
  };
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, withTooltip };

import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';

import { Button } from '@/base/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/base/components/ui/tooltip';

type StoryProps = {
  defaultOpen?: ComponentProps<typeof Tooltip>['defaultOpen'];
  open?: ComponentProps<typeof Tooltip>['open'];
  onOpenChange?: ComponentProps<typeof Tooltip>['onOpenChange'];
  delayDuration?: ComponentProps<typeof Tooltip>['delayDuration'];
  side?: ComponentProps<typeof TooltipContent>['side'];
  sideOffset?: ComponentProps<typeof TooltipContent>['sideOffset'];
  align?: ComponentProps<typeof TooltipContent>['align'];
  alignOffset?: ComponentProps<typeof TooltipContent>['alignOffset'];
};

const meta: Meta<StoryProps> = {
  component: Tooltip,
  title: 'Components/Overlay/Tooltip',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description />
          <p>
            Crafted by{' '}
            <a href="https://ui.shadcn.com/docs/components/tooltip" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://www.radix-ui.com/primitives/docs/components/tooltip" target="_blank">
              Radix UI
            </a>
          </p>
          <DocBlock.Primary />
          <DocBlock.Controls />
        </>
      ),
    },
  },
  args: {
    defaultOpen: false,
    onOpenChange: fn(),
    delayDuration: 700,
    side: 'top',
    sideOffset: 0,
    align: 'center',
    alignOffset: 0,
  },
  argTypes: {
    defaultOpen: {
      description:
        'The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state.',
    },
    open: {
      control: 'boolean',
      description:
        'The controlled open state of the tooltip. Must be used in conjunction with `onOpenChange`.',
    },
    delayDuration: {
      description:
        'The duration from when the mouse enters a tooltip trigger until the tooltip opens.',
      table: {
        defaultValue: {
          summary: '700',
        },
      },
    },
    side: {
      control: 'select',
      description: 'The preferred side of the trigger to render against when open',
      options: ['top', 'right', 'bottom', 'left'],
      table: {
        defaultValue: {
          summary: 'top',
        },
      },
    },
    sideOffset: {
      description: 'The distance in pixels from the trigger.',
      table: {
        defaultValue: {
          summary: '0',
        },
      },
    },
    align: {
      control: 'select',
      description: 'The preferred alignment against the trigger',
      options: ['center', 'start', 'end'],
      table: {
        defaultValue: {
          summary: 'center',
        },
      },
    },
    alignOffset: {
      description: 'An offset in pixels from the `start` or `end` alignment options.',
      table: {
        defaultValue: {
          summary: '0',
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Tooltip',
  render: (props) => (
    <TooltipProvider>
      <Tooltip
        defaultOpen={props.defaultOpen}
        open={props.open}
        delayDuration={props.delayDuration}
      >
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent
          side={props.side}
          sideOffset={props.sideOffset}
          align={props.align}
          alignOffset={props.alignOffset}
        >
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { toast } from 'sonner';

import { Button } from '@/base/components/ui/button';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof Toaster>;

const meta: Meta<StoryProps> = {
  component: Toaster,
  title: 'Components/Feedback/Toaster',
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
            <a href="https://ui.shadcn.com/docs/components/sonner" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://sonner.emilkowal.ski/" target="_blank">
              sonner
            </a>
          </p>
          <DocBlock.Primary />
          <DocBlock.Controls />
        </>
      ),
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      table: {
        defaultValue: {
          summary: 'bottom-right',
        },
      },
    },
    richColors: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
    expand: {
      control: 'boolean',
      description:
        'If `false`, the visible toasts will expand on mouse hover. Otherwise, the toasts will always expand',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
    visibleToasts: {
      control: {
        type: 'number',
        min: 1,
      },
      description: 'The amount of toasts visible',
      table: {
        defaultValue: {
          summary: '3',
        },
      },
    },
    closeButton: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
    duration: {
      control: {
        type: 'number',
        min: 1,
      },
      table: {
        defaultValue: {
          summary: '5000',
        },
      },
    },
  },
  args: {
    position: 'bottom-right',
    richColors: false,
    expand: false,
    closeButton: false,
    duration: 5000,
    visibleToasts: 3,
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Toaster',
  render: (props) => (
    <>
      <Button
        onClick={() => {
          toast.success('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => fn(),
            },
          });
        }}
      >
        Show Toast
      </Button>
      <Toaster {...props} />
    </>
  ),
};

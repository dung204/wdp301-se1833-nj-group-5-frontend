import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { Bold, Italic, Underline } from 'lucide-react';
import { ComponentProps } from 'react';

import { Toggle } from '@/base/components/ui/toggle';

type StoryProps = ComponentProps<typeof Toggle>;

const meta: Meta<StoryProps> = {
  component: Toggle,
  title: 'Components/Form/Toggle',
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
            <a href="https://ui.shadcn.com/docs/components/toggle" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://www.radix-ui.com/primitives/docs/components/toggle" target="_blank">
              Radix UI
            </a>
          </p>
          <DocBlock.Primary />
          <DocBlock.Controls />
          <DocBlock.Stories />
        </>
      ),
    },
  },
  args: {
    defaultPressed: false,
    onPressedChange: () => {},
    disabled: false,
    variant: 'default',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline'],
      table: {
        defaultValue: {
          summary: 'default',
        },
      },
      description: 'The variant of the toggle.',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
      table: {
        defaultValue: {
          summary: 'default',
        },
      },
    },
    defaultPressed: {
      description:
        'The pressed state of the toggle when it is initially rendered. Use when you do not need to control its pressed state.',
    },
    pressed: {
      control: 'boolean',
      description:
        'The controlled pressed state of the toggle. Must be used in conjunction with `onPressedChange`.',
    },
    disabled: {
      description: 'When `true`, prevents the user from interacting with the toggle.',
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Toggle',
  render: (props) => (
    <Toggle aria-label="Toggle bold" {...props}>
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
  render: (props) => (
    <Toggle aria-label="Toggle italic" {...props}>
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (props) => (
    <Toggle aria-label="Toggle italic" {...props}>
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  render: (props) => (
    <Toggle aria-label="Toggle italic" {...props}>
      <Italic className="h-4 w-4" />
    </Toggle>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (props) => (
    <Toggle aria-label="Toggle underlined" {...props}>
      <Underline className="h-4 w-4" />
    </Toggle>
  ),
};

import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { Bold, Italic, Underline } from 'lucide-react';
import { ComponentProps } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/base/components/ui/toggle-group';

type StoryProps = ComponentProps<typeof ToggleGroup>;

const meta: Meta<StoryProps> = {
  component: ToggleGroup,
  title: 'Components/Form/ToggleGroup',
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
    type: 'multiple',
    orientation: 'horizontal',
    variant: 'default',
    size: 'default',
    rovingFocus: true,
    disabled: false,
  },
  argTypes: {
    type: {
      control: 'select',
      description: 'Determines whether a single or multiple items can be pressed at a time.',
      options: ['single', 'multiple'],
    },
    orientation: {
      control: 'select',
      description:
        'The orientation of the component, which determines how focus moves: `horizontal` for left/right arrows and `vertical` for up/down arrows.',
      options: ['horizontal', 'vertical'],
    },
    rovingFocus: {
      control: 'boolean',
      description: 'When `false`, navigating through the items using arrow keys will be disabled.',
      table: {
        defaultValue: {
          summary: 'true',
        },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline'],
      table: {
        defaultValue: {
          summary: 'default',
        },
      },
      description: 'The variant for every toggle group items.',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
      table: {
        defaultValue: {
          summary: 'default',
        },
      },
      description: 'The size for evert toggle group items.',
    },
    disabled: {
      control: 'boolean',
      description:
        'If `true`, the toggle group will be disabled and all toggle group items will be disabled.',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
  },
  render: (props) => (
    <ToggleGroup {...props}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'ToggleGroup',
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Single: Story = {
  args: {
    type: 'single',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

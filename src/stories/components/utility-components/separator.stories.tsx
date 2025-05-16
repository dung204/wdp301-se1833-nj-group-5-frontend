import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { Separator } from '@/base/components/ui/separator';

type StoryProps = ComponentProps<typeof Separator>;

const meta: Meta<StoryProps> = {
  component: Separator,
  title: 'Components/Utility Components/Separator',
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
            <a href="https://ui.shadcn.com/docs/components/separator" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://www.radix-ui.com/primitives/docs/components/separator" target="_blank">
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
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      table: {
        defaultValue: {
          summary: 'horizontal',
        },
      },
      description: 'The orientation of the separator.',
    },
    decorative: {
      control: { type: 'boolean' },
      description:
        'When `true`, signifies that it is purely visual, carries no semantic meaning, and ensures it is not present in the accessibility tree.',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Separator',
  render: (props) => (
    <div className="flex size-[200px] items-center justify-center">
      <Separator className="border" {...props} />
    </div>
  ),
};

export const Example: Story = {
  render: () => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
  parameters: {
    controls: {
      exclude: ['orientation', 'decorative'],
    },
  },
};

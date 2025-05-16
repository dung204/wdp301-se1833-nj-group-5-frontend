import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { Slider } from '@/base/components/ui/slider';

type StoryProps = ComponentProps<typeof Slider>;

const meta: Meta<StoryProps> = {
  component: Slider,
  title: 'Components/Form/Slider',
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
            <a href="https://ui.shadcn.com/docs/components/slider" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://www.radix-ui.com/primitives/docs/components/slider" target="_blank">
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
    max: 100,
    min: 0,
    step: 1,
  },
  argTypes: {
    max: {
      control: 'number',
    },
    min: {
      control: 'number',
    },
    step: {
      control: 'number',
    },
  },
  render: (props) => (
    <div className="w-[400px]">
      <Slider {...props} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Slider',
  args: {
    defaultValue: [33],
  },
};

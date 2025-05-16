import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { Progress } from '@/base/components/ui/progress';

type StoryProps = ComponentProps<typeof Progress>;

const meta: Meta<StoryProps> = {
  component: Progress,
  title: 'Components/Feedback/Progress',
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
            <a href="https://ui.shadcn.com/docs/components/progress" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://www.radix-ui.com/primitives/docs/components/progress" target="_blank">
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
    value: 50,
    max: 100,
  },
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'The current progress value.',
    },
    max: {
      control: { type: 'number' },
      description: 'The maximum progress value.',
    },
  },
  render: (props) => <Progress {...props} className="w-[400px]" />,
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Progress',
};

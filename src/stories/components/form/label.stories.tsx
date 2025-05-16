import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { Checkbox } from '@/base/components/ui/checkbox';
import { Label } from '@/base/components/ui/label';

type StoryProps = ComponentProps<typeof Label>;

const meta: Meta<StoryProps> = {
  title: 'Components/Form/Label',
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
            <a href="https://ui.shadcn.com/docs/components/label" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://www.radix-ui.com/primitives/docs/components/label" target="_blank">
              Radix UI
            </a>
          </p>
          <DocBlock.Primary />
        </>
      ),
    },
  },
  args: {
    children: 'Accept terms and conditions',
  },
  render: (props) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" {...props} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Label',
};

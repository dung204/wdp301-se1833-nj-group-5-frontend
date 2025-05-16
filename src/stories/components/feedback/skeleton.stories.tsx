import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from '@/base/components/ui/skeleton';

type StoryProps = unknown;

const meta: Meta<StoryProps> = {
  title: 'Components/Feedback/Skeleton',
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
            <a href="https://ui.shadcn.com/docs/components/skeleton" target="_blank">
              shadcn
            </a>
          </p>
          <DocBlock.Primary />
        </>
      ),
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Skeleton',
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
`,
      },
    },
  },
};

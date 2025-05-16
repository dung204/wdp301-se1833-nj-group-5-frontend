import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/base/components/ui/avatar';
import { Skeleton } from '@/base/components/ui/skeleton';

type StoryProps = {
  fallbackDelayMs: number;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Data Display/Avatar',
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description />
          <DocBlock.Primary />
          <DocBlock.Stories />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    fallbackDelayMs: 2000,
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Avatar',
  render: ({ fallbackDelayMs }) => (
    <Avatar>
      <AvatarImage src="/code_mely_avatar.jpg" alt="@codemely" />
      <AvatarFallback delayMs={fallbackDelayMs}>CM</AvatarFallback>
    </Avatar>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Avatar>
  <AvatarImage src="/code_mely_avatar.jpg" alt="@codemely" />
  <AvatarFallback>CM</AvatarFallback>
</Avatar>`,
      },
    },
  },
};

export const SkeletonAsFallback: Story = {
  render: ({ fallbackDelayMs }) => (
    <Avatar>
      <AvatarImage src="/code_mely_avatar.jpg" alt="@codemely" />
      <AvatarFallback delayMs={fallbackDelayMs}>
        <Skeleton className="size-full" />
      </AvatarFallback>
    </Avatar>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Avatar>
  <AvatarImage src="/code_mely_avatar.jpg" alt="@codemely" />
  <AvatarFallback>
    <Skeleton className="size-full" />
  </AvatarFallback>
</Avatar>`,
      },
    },
  },
};

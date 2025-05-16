import { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';
import { ComponentProps } from 'react';

import { AspectRatio } from '@/base/components/ui/aspect-ratio';
import { cn } from '@/base/lib';

type StoryProps = ComponentProps<typeof AspectRatio>;

const meta: Meta<StoryProps> = {
  component: AspectRatio,
  title: 'Components/Utility Components/AspectRatio',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'number',
      description: 'The desired ratio of the component (i.e. 16/9, 4/3, 1/1, etc.)',
    },
  },
  render: ({ className, ...props }) => (
    <div className="w-[450px]">
      <AspectRatio {...props} className={cn('relative overflow-hidden rounded-lg', className)}>
        <Image src="/code_mely_avatar.jpg" alt="Code MeLy Avatar" fill className="object-cover" />
      </AspectRatio>
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const SixteenByNine: Story = {
  name: '16:9',
  args: {
    ratio: 16 / 9,
  },
};

export const FourByThree: Story = {
  name: '4:3',
  args: {
    ratio: 4 / 3,
  },
};

export const OneByOne: Story = {
  name: '1:1',
  args: {
    ratio: 1,
  },
};

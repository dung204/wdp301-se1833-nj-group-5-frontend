import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { Badge, badgeVariants } from '@/base/components/ui/badge';

type StoryProps = ComponentProps<typeof Badge>;

const meta: Meta<StoryProps> = {
  component: Badge,
  title: 'Components/Data Display/Badge',
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['asChild'],
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Click me',
  },
  argTypes: {
    variant: {
      options: badgeVariants,
      control: { type: 'select' },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  args: {
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  parameters: {
    controls: {
      exclude: ['variant', 'asChild'],
    },
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
  },
  parameters: {
    controls: {
      exclude: ['variant', 'asChild'],
    },
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
  },
  parameters: {
    controls: {
      exclude: ['variant', 'asChild'],
    },
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
  },
  parameters: {
    controls: {
      exclude: ['variant', 'asChild'],
    },
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
  parameters: {
    controls: {
      exclude: ['variant', 'asChild'],
    },
  },
};

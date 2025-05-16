import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ChevronRight, Mail } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button, buttonSizes, buttonVariants } from '@/base/components/ui/button';

type StoryProps = ComponentProps<typeof Button>;

const meta: Meta<StoryProps> = {
  component: Button,
  title: 'Components/Form/Button',
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['asChild'],
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Click me',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      options: buttonVariants,
      control: { type: 'select' },
    },
    size: {
      options: buttonSizes,
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

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
  parameters: {
    controls: {
      exclude: ['variant', 'asChild'],
    },
  },
};

export const ButtonLink: Story = {
  name: 'Link',
  args: {
    variant: 'link',
  },
  parameters: {
    controls: {
      exclude: ['variant', 'asChild'],
    },
  },
};

export const IconOnlyButton: Story = {
  args: {
    children: <ChevronRight />,
    size: 'icon',
  },
  parameters: {
    controls: {
      exclude: ['asChild', 'children'],
    },
  },
};

export const TextButtonWithIcon: Story = {
  args: {
    children: (
      <>
        <Mail />
        <span>Login with email</span>
      </>
    ),
  },
  parameters: {
    controls: {
      exclude: ['asChild', 'children'],
    },
  },
};

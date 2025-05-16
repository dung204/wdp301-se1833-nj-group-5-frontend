import { Meta, StoryObj } from '@storybook/react';
import { Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/base/components/ui/alert';

const meta: Meta<unknown> = {
  title: 'Components/Feedback/Alert',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<unknown>;

export const Primary: Story = {
  decorators: [
    () => (
      <Alert>
        <Info className="size-4" />
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>This is the description of the alert</AlertDescription>
      </Alert>
    ),
  ],
  parameters: {
    docs: {
      source: {
        code: `<Alert>
  <Info className="size-4" />
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>This is the description of the alert</AlertDescription>
</Alert>`,
      },
    },
  },
};

export const Danger: Story = {
  decorators: [
    () => (
      <Alert variant="danger">
        <Info className="size-4" />
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>This is the description of the alert</AlertDescription>
      </Alert>
    ),
  ],
  parameters: {
    docs: {
      source: {
        code: `<Alert variant="danger">
  <Info className="size-4" />
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>This is the description of the alert</AlertDescription>
</Alert>`,
      },
    },
  },
};

export const Success: Story = {
  decorators: [
    () => (
      <Alert variant="success">
        <Info className="size-4" />
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>This is the description of the alert</AlertDescription>
      </Alert>
    ),
  ],
  parameters: {
    docs: {
      source: {
        code: `
<Alert variant="success">
  <Info className="size-4" />
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>This is the description of the alert</AlertDescription>
</Alert>`,
      },
    },
  },
};

export const Warning: Story = {
  decorators: [
    () => (
      <Alert variant="warning">
        <Info className="size-4" />
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>This is the description of the alert</AlertDescription>
      </Alert>
    ),
  ],
  parameters: {
    docs: {
      source: {
        code: `
<Alert variant="warning">
  <Info className="size-4" />
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>This is the description of the alert</AlertDescription>
</Alert>`,
      },
    },
  },
};

import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Form } from '@/base/components/ui/form';
import { PasswordInput } from '@/base/components/ui/password-input';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof PasswordInput>;

const meta: Meta<StoryProps> = {
  component: PasswordInput,
  title: 'Components/Form/PasswordInput',
  parameters: {
    layout: 'centered',
  },
  args: {
    placeholder: 'Placeholder',
    defaultShowPassword: false,
    disabled: false,
    onChange: () => {},
  },
  argTypes: {
    placeholder: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: 'boolean',
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'PasswordInput',
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithForm: Story = {
  render: () => (
    <div className="w-[300px]">
      <Form
        schema={z.object({
          username: z.string().min(2, {
            message: 'Username must be at least 2 characters.',
          }),
          password: z.string().min(8, {
            message: 'Password must be at least 8 characters.',
          }),
        })}
        fields={[
          { name: 'username', label: 'Username', type: 'text' },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
        onSuccessSubmit={(data) => {
          toast('You submitted the following values', {
            description: (
              <pre className="mt-2 w-full rounded-lg bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(data, null, 2)}</code>
              </pre>
            ),
          });
        }}
      />
      <Toaster />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<div className="w-[300px]">
  <Form
    schema={z.object({
      username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
      }),
      password: z.string().min(8, {
        message: 'Password must be at least 8 characters.',
      }),
    })}
    fields={[
      { name: 'username', label: 'Username', type: 'text' },
      { name: 'password', label: 'Password', type: 'password' },
    ]}
    onSuccessSubmit={(data) => {
      toast('You submitted the following values', {
        description: (
          <pre className="mt-2 w-full rounded-lg bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }}
  />
  <Toaster />
</div>
`,
      },
    },
  },
};

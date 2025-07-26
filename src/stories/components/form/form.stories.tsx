import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Form } from '@/base/components/ui/form';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof Form>;

const meta: Meta<StoryProps> = {
  component: Form,
  title: 'Components/Form/Form',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-[300px]">
      <Form {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Form',
  args: {
    schema: z.object({
      username: z.string().trim().nonempty('Username is required'),
      password: z.string().trim().min(8, 'Password must be at least 8 characters long'),
      language: z.enum(['en', 'vi'], { message: 'Language is required' }),
    }),
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'Enter your username',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
      },
      {
        name: 'language',
        label: 'Language',
        type: 'select',
        options: [
          { value: 'en', label: 'English' },
          { value: 'vi', label: 'Vietnamese' },
        ],
      },
    ],
    onSuccessSubmit: (data) => {
      toast('You submitted the following values', {
        description: (
          <pre className="mt-2 w-full rounded-lg bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    },
  },
  render: (args) => {
    return (
      <div className="w-[300px]">
        <Form {...args} />
        <Toaster />
      </div>
    );
  },
};

import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Form } from '@/base/components/ui/form';
import { TimePicker } from '@/base/components/ui/time-picker';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof TimePicker>;

const meta: Meta<StoryProps> = {
  component: TimePicker,
  title: 'Components/Form/TimePicker',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-[300px]">
      <TimePicker {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'TimePicker',
};

export const Disabled: Story = {
  args: {
    disabled: true,
    date: new Date(),
  },
};

export const WithForm: Story = {
  render: () => (
    <div className="w-[300px]">
      <Form
        schema={z.object({
          time: z.date({ required_error: 'Time is required' }),
        })}
        fields={[{ name: 'time', label: 'Time', type: 'time' }]}
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
      time: z.date({ required_error: 'Time is required' }),
    })}
    fields={[{ name: 'time', label: 'Time', type: 'time' }]}
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

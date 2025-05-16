import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { DateTimePicker } from '@/base/components/ui/date-time-picker';
import { Form } from '@/base/components/ui/form';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof DateTimePicker>;

const meta: Meta<StoryProps> = {
  component: DateTimePicker,
  title: 'Components/Form/DateTimePicker',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-[300px]">
      <DateTimePicker {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'DateTimePicker',
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
          datetime: z.date({ required_error: 'Date time is required' }),
        })}
        fields={[{ name: 'datetime', label: 'Datetime', type: 'datetime' }]}
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
      datetime: z.date({ required_error: 'Date time is required' }),
    })}
    fields={[{ name: 'datetime', label: 'Date time', type: 'datetime' }]}
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

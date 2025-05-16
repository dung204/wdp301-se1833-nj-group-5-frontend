import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { DatePicker } from '@/base/components/ui/date-picker';
import { Form } from '@/base/components/ui/form';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof DatePicker>;

const meta: Meta<StoryProps> = {
  component: DatePicker,
  title: 'Components/Form/DatePicker',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-[300px]">
      <DatePicker {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'DatePicker',
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
          date: z.date({ required_error: 'Date is required' }),
        })}
        fields={[{ name: 'date', label: 'Date', type: 'date' }]}
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
      date: z.date({ required_error: 'Date is required' }),
    })}
    fields={[{ name: 'date', label: 'Date', type: 'date' }]}
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

import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { DateRangePicker } from '@/base/components/ui/date-range-picker';
import { Form } from '@/base/components/ui/form';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof DateRangePicker>;

const meta: Meta<StoryProps> = {
  component: DateRangePicker,
  title: 'Components/Form/DateRangePicker',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-[300px]">
      <DateRangePicker {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'DateRangePicker',
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
          dateRange: z.object(
            {
              from: z.date(),
              to: z.date().optional(),
            },
            {
              required_error: 'A date range is required',
            },
          ),
        })}
        fields={[{ name: 'dateRange', label: 'Date range', type: 'date', range: true }]}
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
      dateRange: z.object(
        {
          from: z.date(),
          to: z.date().optional(),
        },
        {
          required_error: 'A date range is required',
        },
      ),
    })}
    fields={[{ name: 'dateRange', label: 'Date range', type: 'date', range: true }]}
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

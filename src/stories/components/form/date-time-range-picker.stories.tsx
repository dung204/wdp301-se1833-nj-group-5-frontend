import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { DateTimeRangePicker } from '@/base/components/ui/date-time-range-picker';
import { Form } from '@/base/components/ui/form';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof DateTimeRangePicker>;

const meta: Meta<StoryProps> = {
  component: DateTimeRangePicker,
  title: 'Components/Form/DateTimeRangePicker',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-[300px]">
      <DateTimeRangePicker {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'DateTimeRangePicker',
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
          dateTimeRange: z.object(
            {
              from: z.date(),
              to: z.date().optional(),
            },
            {
              required_error: 'A date range is required',
            },
          ),
        })}
        fields={[
          { name: 'dateTimeRange', label: 'Date time range', type: 'datetime', range: true },
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

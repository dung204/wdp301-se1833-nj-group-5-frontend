import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Form } from '@/base/components/ui/form';
import { TimeRangePicker } from '@/base/components/ui/time-range-picker';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof TimeRangePicker>;

const meta: Meta<StoryProps> = {
  component: TimeRangePicker,
  title: 'Components/Form/TimeRangePicker',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-[300px]">
      <TimeRangePicker {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'TimeRangePicker',
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
          timeRange: z.object(
            {
              from: z.date(),
              to: z.date().optional(),
            },
            {
              required_error: 'A time range is required',
            },
          ),
        })}
        fields={[{ name: 'timeRange', label: 'Time range', type: 'time', range: true }]}
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
      timeRange: z.object(
        {
          from: z.date(),
          to: z.date().optional(),
        },
        {
          required_error: 'A time range is required',
        },
      ),
    })}
    fields={[{ name: 'timeRange', label: 'Time range', type: 'time', range: true }]}
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

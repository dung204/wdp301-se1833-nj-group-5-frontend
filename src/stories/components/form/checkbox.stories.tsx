import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Checkbox } from '@/base/components/ui/checkbox';
import { Form } from '@/base/components/ui/form';
import { Label } from '@/base/components/ui/label';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof Checkbox>;

const meta: Meta<StoryProps> = {
  title: 'Components/Form/Checkbox',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    checked: false,
    disabled: false,
  },
  render: function Comp(props) {
    const [, setArgs] = useArgs<StoryProps>();

    return (
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" {...props} onCheckedChange={(checked) => setArgs({ checked })} />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Checkbox',
};

export const WithForm: Story = {
  render: () => (
    <div className="w-[300px]">
      <Form
        schema={z.object({
          mobile: z.boolean().optional().default(false),
        })}
        fields={[
          {
            name: 'mobile',
            label: 'Use different settings for my mobile devices',
            description: 'You can manage your mobile notifications in the mobile settings page.',
            type: 'checkbox',
          },
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
    })}
    fields={[{ name: 'username', label: 'Username', type: 'text' }]}
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

import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Form } from '@/base/components/ui/form';
import { Label } from '@/base/components/ui/label';
import { Switch } from '@/base/components/ui/switch';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof Switch>;

const meta: Meta<StoryProps> = {
  component: Switch,
  title: 'Components/Form/Switch',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description />
          <p>
            Crafted by{' '}
            <a href="https://ui.shadcn.com/docs/components/switch" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://www.radix-ui.com/primitives/docs/components/switch" target="_blank">
              Radix UI
            </a>
          </p>
          <DocBlock.Primary />
          <DocBlock.Controls />
          <DocBlock.Stories />
        </>
      ),
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Switch',
  render: (props) => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" {...props} />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const WithForm: Story = {
  name: 'Form',
  render: () => (
    <div className="w-[600px]">
      <Form
        schema={z.object({
          marketing_emails: z.boolean().default(false).optional(),
          security_emails: z.boolean().default(true),
        })}
        fields={[
          {
            name: 'marketing_emails',
            label: 'Marketing emails',
            type: 'switch',
            description: 'Receive emails about new products, features, and more.',
            render: ({ Label, Description, Control }) => (
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base" />
                  <Description />
                </div>
                <Control />
              </div>
            ),
          },
          {
            name: 'security_emails',
            label: 'Security emails',
            type: 'switch',
            disabled: true,
            description: 'Receive emails about your account security.',
            render: ({ Label, Description, Control }) => (
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label required={false} className="text-base" />
                  <Description />
                </div>
                <Control />
              </div>
            ),
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
<div className="w-[600px]">
  <Form
    schema={z.object({
      marketing_emails: z.boolean().default(false).optional(),
      security_emails: z.boolean().default(true),
    })}
    fields={[
      {
        name: 'marketing_emails',
        label: 'Marketing emails',
        type: 'switch',
        description: 'Receive emails about new products, features, and more.',
        render: ({ Label, Description, Control }) => (
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base" />
              <Description />
            </div>
            <Control />
          </div>
        ),
      },
      {
        name: 'security_emails',
        label: 'Security emails',
        type: 'switch',
        disabled: true,
        description: 'Receive emails about your account security.',
        render: ({ Label, Description, Control }) => (
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label required={false} className="text-base" />
              <Description />
            </div>
            <Control />
          </div>
        ),
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
`,
      },
    },
  },
};

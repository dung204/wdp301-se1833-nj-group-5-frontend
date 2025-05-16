import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Form } from '@/base/components/ui/form';
import { Textarea } from '@/base/components/ui/textarea';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof Textarea>;

const meta: Meta<StoryProps> = {
  component: Textarea,
  title: 'Components/Form/Textarea',
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
            <a href="https://ui.shadcn.com/docs/components/sonner" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://sonner.emilkowal.ski/" target="_blank">
              sonner
            </a>
          </p>
          <DocBlock.Primary />
          <DocBlock.Controls />
          <DocBlock.Stories />
        </>
      ),
    },
  },
  args: {
    placeholder: 'Type your message here.',
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Textarea',
  render: (props) => <Textarea {...props} className="h-[5lh] w-[400px]" />,
};

export const WithForm: Story = {
  render: () => (
    <div className="w-[400px]">
      <Form
        schema={z.object({
          bio: z
            .string()
            .min(10, {
              message: 'Bio must be at least 10 characters.',
            })
            .max(160, {
              message: 'Bio must not be longer than 30 characters.',
            }),
        })}
        fields={[
          {
            name: 'bio',
            label: 'Bio',
            type: 'textarea',
            render: ({ Label, Control, Description, Message }) => (
              <>
                <Label />
                <Control className="h-[5lh]" />
                <Description />
                <Message />
              </>
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
<div className="w-[300px]">
  <Form
    schema={z.object({
      bio: z
        .string({ required_error: 'Bio is required.' })
        .min(10, {
          message: 'Bio must be at least 10 characters.',
        })
        .max(160, {
          message: 'Bio must not be longer than 30 characters.',
        }),
    })}
    fields={[{ name: 'bio', label: 'Bio', type: 'textarea' }]}
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

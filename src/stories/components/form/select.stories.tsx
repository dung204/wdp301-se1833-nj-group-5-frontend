import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Form } from '@/base/components/ui/form';
import { Select } from '@/base/components/ui/select';
import { Toaster } from '@/base/components/ui/toaster';

type StoryProps = ComponentProps<typeof Select>;

const meta: Meta<StoryProps> = {
  component: Select,
  title: 'Components/Form/Select',
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
            <a href="https://ui.shadcn.com/docs/components/select" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://www.radix-ui.com/primitives/docs/components/select" target="_blank">
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
  render: (args) => (
    <div className="w-[300px]">
      <Select {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Select',
  args: {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'blueberry', label: 'Blueberry' },
      { value: 'grapes', label: 'Grapes' },
      { value: 'pineapple', label: 'Pineapple' },
    ],
  },
};

export const Searchable: Story = {
  args: {
    searchable: true,
    options: [
      { value: 'est', label: 'Eastern Standard Time (EST)' },
      { value: 'cst', label: 'Central Standard Time (CST)' },
      { value: 'mst', label: 'Mountain Standard Time (MST)' },
      { value: 'pst', label: 'Pacific Standard Time (PST)' },
      { value: 'akst', label: 'Alaska Standard Time (AKST)' },
      { value: 'hst', label: 'Hawaii Standard Time (HST)' },
      { value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
      { value: 'cet', label: 'Central European Time (CET)' },
      { value: 'eet', label: 'Eastern European Time (EET)' },
      { value: 'west', label: 'Western European Summer Time (WEST)' },
      { value: 'cat', label: 'Central Africa Time (CAT)' },
      { value: 'eat', label: 'East Africa Time (EAT)' },
      { value: 'msk', label: 'Moscow Time (MSK)' },
      { value: 'ist', label: 'India Standard Time (IST)' },
      { value: 'cst_china', label: 'China Standard Time (CST)' },
      { value: 'jst', label: 'Japan Standard Time (JST)' },
      { value: 'kst', label: 'Korea Standard Time (KST)' },
      { value: 'ist_indonesia', label: 'Indonesia Central Standard Time (WITA)' },
      { value: 'awst', label: 'Australian Western Standard Time (AWST)' },
      { value: 'acst', label: 'Australian Central Standard Time (ACST)' },
      { value: 'aest', label: 'Australian Eastern Standard Time (AEST)' },
      { value: 'nzst', label: 'New Zealand Standard Time (NZST)' },
      { value: 'fjt', label: 'Fiji Time (FJT)' },
      { value: 'art', label: 'Argentina Time (ART)' },
      { value: 'bot', label: 'Bolivia Time (BOT)' },
      { value: 'brt', label: 'Brasilia Time (BRT)' },
      { value: 'clt', label: 'Chile Standard Time (CLT)' },
    ],
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'blueberry', label: 'Blueberry' },
      { value: 'grapes', label: 'Grapes' },
      { value: 'pineapple', label: 'Pineapple' },
    ],
  },
};

export const WithForm: Story = {
  render: () => (
    <div className="w-[300px]">
      <Form
        className="flex flex-col gap-6"
        schema={z.object({
          gender: z.enum(['male', 'female'], { message: 'Please choose a gender' }),
          skills: z.array(z.string().trim()).nonempty('Please select at least one skill'),
        })}
        fields={[
          {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            searchable: false,
            options: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ],
          },
          {
            name: 'skills',
            label: 'Skills',
            type: 'select',
            multiple: true,
            options: [
              { value: 'html', label: 'HTML' },
              { value: 'css', label: 'CSS' },
              { value: 'js', label: 'JavaScript' },
              { value: 'react', label: 'React' },
              { value: 'vue', label: 'Vue' },
              { value: 'angular', label: 'Angular' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'typescript', label: 'TypeScript' },
              { value: 'python', label: 'Python' },
              { value: 'java', label: 'Java' },
              { value: 'csharp', label: 'C#' },
              { value: 'php', label: 'PHP' },
              { value: 'ruby', label: 'Ruby' },
              { value: 'go', label: 'Go' },
            ],
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
    className="flex flex-col gap-6"
    schema={z.object({
      gender: z.enum(['male', 'female'], { message: 'Please choose a gender' }),
      skills: z.array(z.string().trim()).nonempty('Please select at least one skill'),
    })}
    fields={[
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        searchable: false,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ],
      },
      {
        name: 'skills',
        label: 'Skills',
        type: 'select',
        multiple: true,
        options: [
          { value: 'html', label: 'HTML' },
          { value: 'css', label: 'CSS' },
          { value: 'js', label: 'JavaScript' },
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'angular', label: 'Angular' },
          { value: 'svelte', label: 'Svelte' },
          { value: 'typescript', label: 'TypeScript' },
          { value: 'python', label: 'Python' },
          { value: 'java', label: 'Java' },
          { value: 'csharp', label: 'C#' },
          { value: 'php', label: 'PHP' },
          { value: 'ruby', label: 'Ruby' },
          { value: 'go', label: 'Go' },
        ],
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

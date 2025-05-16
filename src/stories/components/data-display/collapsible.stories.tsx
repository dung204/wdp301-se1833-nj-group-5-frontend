import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { ChevronsUpDown } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from '@/base/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/base/components/ui/collapsible';

type StoryProps = ComponentProps<typeof Collapsible> & {
  numberOfItemsShown: number;
  numberOfItemsHidden: number;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Data Display/Collapsible',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description of={Collapsible} />
          <DocBlock.Primary />
        </>
      ),
    },
  },
  args: {
    numberOfItemsShown: 3,
    numberOfItemsHidden: 5,
  },
  argTypes: {
    numberOfItemsShown: {
      control: { type: 'number', min: 0 },
    },
    numberOfItemsHidden: {
      control: { type: 'number', min: 0 },
    },
  },
  render: (props) => (
    <Collapsible {...props} className="w-[350px]">
      <div className="flex items-center justify-between">
        <p>
          Code MeLy currently has {props.numberOfItemsShown + props.numberOfItemsHidden} project(s):
        </p>
        <CollapsibleTrigger asChild>
          <Button variant="ghost">
            <ChevronsUpDown className="size-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="space-y-2">
        {Array.from({ length: props.numberOfItemsShown }).map((_, index) => (
          <div key={index} className="rounded-lg border px-4 py-3 font-mono text-sm">
            Project {index + 1}
          </div>
        ))}
      </div>
      <CollapsibleContent className="mt-2 space-y-2">
        {Array.from({ length: props.numberOfItemsHidden }).map((_, index) => (
          <div key={index} className="rounded-lg border px-4 py-3 font-mono text-sm">
            Project {index + props.numberOfItemsShown + 1} (hidden)
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Collapsible',
};

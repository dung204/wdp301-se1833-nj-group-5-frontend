import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { CalendarDays } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/base/components/ui/avatar';
import { Button } from '@/base/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/base/components/ui/hover-card';

const meta: Meta<unknown> = {
  title: 'Components/Overlay/HoverCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description of={HoverCard} />
          <p>
            Crafted by{' '}
            <a href="https://ui.shadcn.com/docs/components/hover-card" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a
              href="https://www.radix-ui.com/primitives/docs/components/hover-card"
              target="_blank"
            >
              Radix UI
            </a>
          </p>
          <DocBlock.Primary />
        </>
      ),
    },
  },
};

export default meta;

type Story = StoryObj<unknown>;

export const Primary: Story = {
  name: 'HoverCard',
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@codemely</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-4">
          <Avatar className="size-12">
            <AvatarImage src="/code_mely_avatar.jpg" />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@codemely</h4>
            <p className="text-sm">Code Mê Ly</p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-muted-foreground text-xs">Joined April 2022</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@codemely</Button>
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="flex gap-4">
      <Avatar className="size-12">
        <AvatarImage src="/code_mely_avatar.jpg" />
        <AvatarFallback>CM</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">@codemely</h4>
        <p className="text-sm">Code Mê Ly</p>
        <div className="flex items-center pt-2">
          <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
          <span className="text-muted-foreground text-xs">Joined April 2022</span>
        </div>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
`,
      },
    },
  },
};

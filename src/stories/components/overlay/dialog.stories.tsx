import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { Copy } from 'lucide-react';

import { Button } from '@/base/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/base/components/ui/dialog';
import { Input } from '@/base/components/ui/input';
import { Label } from '@/base/components/ui/label';

type StoryProps = {
  dialogTitle: string;
  dialogContent: string;
  dialogDescription: string;
  dialogFooter: string;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Overlay/Dialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description of={Dialog} />
          <p>
            Crafted by{' '}
            <a href="https://ui.shadcn.com/docs/components/dialog" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://www.radix-ui.com/primitives/docs/components/dialog" target="_blank">
              Radix UI
            </a>
          </p>
          <DocBlock.Primary />
          <DocBlock.Stories />
        </>
      ),
    },
  },
  args: {
    dialogTitle: 'Dialog Title',
    dialogDescription: 'This is the description of the dialog.',
    dialogContent: 'Dialog Content',
    dialogFooter: 'Dialog Footer',
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Dialog',
  render: (props) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{props.dialogTitle}</DialogTitle>
          <DialogDescription>{props.dialogDescription}</DialogDescription>
        </DialogHeader>
        <div>{props.dialogContent}</div>
        <DialogFooter>
          <div>{props.dialogFooter}</div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Show Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>{props.dialogTitle}</DialogTitle>
      <DialogDescription>{props.dialogDescription}</DialogDescription>
    </DialogHeader>
    <div>{props.dialogContent}</div>
    <DialogFooter>
      <div>{props.dialogFooter}</div>
    </DialogFooter>
  </DialogContent>
</Dialog>
`,
      },
    },
  },
};

export const CustomCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue="https://www.facebook.com/code.mely" readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      source: {
        code: `
import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogCloseButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://www.facebook.com/code.mely"
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
      },
    },
  },
};

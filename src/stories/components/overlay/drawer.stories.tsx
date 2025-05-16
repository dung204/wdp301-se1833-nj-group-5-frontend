import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';

import { Button } from '@/base/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/base/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/base/components/ui/drawer';
import { Input } from '@/base/components/ui/input';
import { Label } from '@/base/components/ui/label';
import { useIsMobile } from '@/base/hooks';
import { cn } from '@/base/lib';

type StoryProps = {
  triggerButtonLabel: string;
  drawerTitle: string;
  drawerDescription: string;
  drawerActionLabel: string;
  drawerCloseLabel: string;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Overlay/Drawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description of={Drawer} />
          <p>
            Crafted by{' '}
            <a href="https://ui.shadcn.com/docs/components/drawer" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a href="https://vaul.emilkowal.ski/getting-started" target="_blank">
              Vaul
            </a>
          </p>
          <DocBlock.Primary />
          <DocBlock.Stories />
        </>
      ),
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Drawer',
  args: {
    triggerButtonLabel: 'Show Dialog',
    drawerTitle: 'Are you absolutely sure?',
    drawerDescription: 'This action cannot be undone.',
    drawerActionLabel: 'Submit',
    drawerCloseLabel: 'Cancel',
  },
  render: (props) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>{props.triggerButtonLabel}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{props.drawerTitle}</DrawerTitle>
          <DrawerDescription>{props.drawerDescription}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>{props.drawerActionLabel}</Button>
          <DrawerClose>
            <Button variant="outline">{props.drawerCloseLabel}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
`,
      },
    },
  },
};

export const ResponsiveDialog: Story = {
  args: {
    triggerButtonLabel: 'Edit profile',
    drawerTitle: 'Edit profile',
    drawerDescription: `Make changes to your profile here. Click save when you're done.`,
    drawerActionLabel: 'Submit',
    drawerCloseLabel: 'Cancel',
  },
  render: function Comp(props) {
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();

    if (!isMobile) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">{props.triggerButtonLabel}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{props.drawerTitle}</DialogTitle>
              <DialogDescription>{props.drawerDescription}</DialogDescription>
            </DialogHeader>
            <ProfileForm />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">{props.triggerButtonLabel}</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{props.drawerTitle}</DrawerTitle>
            <DrawerDescription>{props.drawerDescription}</DrawerDescription>
          </DrawerHeader>
          <ProfileForm className="px-4" />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">{props.drawerCloseLabel}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DrawerDialogDemo() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  )
}
`,
      },
    },
  },
};

function ProfileForm({ className }: ComponentProps<'form'>) {
  return (
    <form className={cn('grid items-start gap-4', className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="code.mely@gmail.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@codemely" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}

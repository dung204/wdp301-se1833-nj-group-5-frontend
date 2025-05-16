import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/base/components/ui/alert-dialog';
import { Button } from '@/base/components/ui/button';

type StoryProps = {
  triggerButtonLabel: string;
  alertDialogTitle: string;
  alertDialogDescription: string;
  alertDialogActionLabel: string;
  alertDialogCancelLabel: string;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Overlay/AlertDialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description />
          <DocBlock.Primary />
          <DocBlock.Stories />
        </>
      ),
    },
  },
  args: {
    triggerButtonLabel: 'Show Dialog',
    alertDialogTitle: 'Are you absolutely sure?',
    alertDialogDescription:
      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    alertDialogActionLabel: 'Continue',
    alertDialogCancelLabel: 'Cancel',
  },
  render: (props) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{props.triggerButtonLabel}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.alertDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{props.alertDialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{props.alertDialogCancelLabel}</AlertDialogCancel>
          <AlertDialogAction>{props.alertDialogActionLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'AlertDialog',
  parameters: {
    docs: {
      source: {
        code: `
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Show Dialog</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account and remove
        your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
      },
    },
  },
};

import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';

import { Label } from '@/base/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/base/components/ui/radio-group';

type StoryProps = unknown;

const meta: Meta<StoryProps> = {
  title: 'Components/Form/RadioGroup',
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
            <a href="https://ui.shadcn.com/docs/components/radio-group" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a
              href="https://www.radix-ui.com/primitives/docs/components/radio-group"
              target="_blank"
            >
              Radix UI
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
  name: 'RadioGroup',
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<RadioGroup defaultValue="comfortable">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="default" id="r1" />
    <Label htmlFor="r1">Default</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="comfortable" id="r2" />
    <Label htmlFor="r2">Comfortable</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="compact" id="r3" />
    <Label htmlFor="r3">Compact</Label>
  </div>
</RadioGroup>`,
      },
    },
  },
};

// const FormSchema = z.object({
//   type: z.enum(['all', 'mentions', 'none'], {
//     required_error: 'You need to select a notification type.',
//   }),
// });

// export const WithForm: Story = {
//   render: () => {
//     const form = useForm<z.infer<typeof FormSchema>>({
//       resolver: zodResolver(FormSchema),
//     });

//     function onSubmit(data: z.infer<typeof FormSchema>) {
//       toast('You submitted the following values:', {
//         description: (
//           <pre className="mt-2 w-full rounded-lg bg-slate-950 p-4">
//             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//           </pre>
//         ),
//       });
//     }

//     return (
//       <>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-6">
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem className="space-y-3">
//                   <FormLabel>Notify me about...</FormLabel>
//                   <FormControl>
//                     <RadioGroup
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       className="flex flex-col space-y-1"
//                     >
//                       <FormItem className="flex items-center space-y-0 space-x-3">
//                         <FormControl>
//                           <RadioGroupItem value="all" />
//                         </FormControl>
//                         <FormLabel className="font-normal">All new messages</FormLabel>
//                       </FormItem>
//                       <FormItem className="flex items-center space-y-0 space-x-3">
//                         <FormControl>
//                           <RadioGroupItem value="mentions" />
//                         </FormControl>
//                         <FormLabel className="font-normal">Direct messages and mentions</FormLabel>
//                       </FormItem>
//                       <FormItem className="flex items-center space-y-0 space-x-3">
//                         <FormControl>
//                           <RadioGroupItem value="none" />
//                         </FormControl>
//                         <FormLabel className="font-normal">Nothing</FormLabel>
//                       </FormItem>
//                     </RadioGroup>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" className="mr-4">
//               Submit
//             </Button>
//           </form>
//         </Form>
//         <Toaster />
//       </>
//     );
//   },
//   parameters: {
//     docs: {
//       source: {
//         code: `
// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

// import { toast } from "sonner"
// import { Button } from "@/components/ui/button"
// import { Toaster } from '@/components/ui/sonner';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// const FormSchema = z.object({
//   type: z.enum(["all", "mentions", "none"], {
//     required_error: "You need to select a notification type.",
//   }),
// })

// export function RadioGroupForm() {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   })

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     toast('You submitted the following values:', {
//       description: (
//         <pre className="mt-2 w-full rounded-lg bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   }

//   return (
//     <>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
//           <FormField
//             control={form.control}
//             name="type"
//             render={({ field }) => (
//               <FormItem className="space-y-3">
//                 <FormLabel>Notify me about...</FormLabel>
//                 <FormControl>
//                   <RadioGroup
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                     className="flex flex-col space-y-1"
//                   >
//                     <FormItem className="flex items-center space-x-3 space-y-0">
//                       <FormControl>
//                         <RadioGroupItem value="all" />
//                       </FormControl>
//                       <FormLabel className="font-normal">
//                         All new messages
//                       </FormLabel>
//                     </FormItem>
//                     <FormItem className="flex items-center space-x-3 space-y-0">
//                       <FormControl>
//                         <RadioGroupItem value="mentions" />
//                       </FormControl>
//                       <FormLabel className="font-normal">
//                         Direct messages and mentions
//                       </FormLabel>
//                     </FormItem>
//                     <FormItem className="flex items-center space-x-3 space-y-0">
//                       <FormControl>
//                         <RadioGroupItem value="none" />
//                       </FormControl>
//                       <FormLabel className="font-normal">Nothing</FormLabel>
//                     </FormItem>
//                   </RadioGroup>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//       <Toaster />
//     </>
//   )
// }`,
//       },
//     },
//   },
// };

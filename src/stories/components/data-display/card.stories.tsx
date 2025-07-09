import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';

import { AspectRatio } from '@/base/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/base/components/ui/card';

type StoryProps = {
  cardTitle: string;
  cardDescription: string;
  cardContent: string;
  cardFooter: string;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Data Display/Card',
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
    cardTitle: 'Card Title',
    cardDescription: 'This is the description of the card.',
    cardContent: 'Card Content',
    cardFooter: 'Card Footer',
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Primary: Story = {
  name: 'Card',
  render: (props) => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{props.cardTitle}</CardTitle>
        <CardDescription>{props.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.cardContent}</p>
      </CardContent>
      <CardFooter>
        <p>{props.cardFooter}</p>
      </CardFooter>
    </Card>
  ),
};

// const loginSchema = z.object({
//   email: z.string().trim().nonempty('Email must not be empty').email('Email is invalid'),
//   password: z.string().trim().nonempty('Password must not be empty'),
// });

// type LoginSchema = z.infer<typeof loginSchema>;

// export const WithForm: Story = {
//   args: {
//     cardTitle: 'Sign in',
//     cardDescription: 'Enter your credentials to access your account.',
//   },
//   render: function Comp({ cardTitle, cardDescription }) {
//     const form = useForm({
//       resolver: zodResolver(loginSchema),
//       defaultValues: {
//         email: '',
//         password: '',
//       },
//     });

//     const onSubmit = (data: LoginSchema) => {
//       toast(`You've submitted the following data`, {
//         description: (
//           <pre className="mt-2 w-full rounded-lg bg-slate-950 p-4">
//             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//           </pre>
//         ),
//       });
//     };

//     return (
//       <>
//         <Card className="w-[350px]">
//           <CardHeader>
//             <CardTitle>{cardTitle}</CardTitle>
//             <CardDescription>{cardDescription}</CardDescription>
//           </CardHeader>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//               <CardContent className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel required>Username</FormLabel>
//                       <FormControl>
//                         <Input placeholder="code.mely@gmail.com" autoComplete="email" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel required>Password</FormLabel>
//                       <FormControl>
//                         <Input type="password" autoComplete="current-password" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </CardContent>
//               <CardFooter className="mt-4">
//                 <Button type="submit" className="w-full">
//                   Sign in
//                 </Button>
//               </CardFooter>
//             </form>
//           </Form>
//         </Card>
//         <Toaster />
//       </>
//     );
//   },
//   parameters: {
//     controls: {
//       exclude: ['cardContent', 'cardFooter'],
//     },
//     docs: {
//       source: {
//         code: `
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { z } from 'zod';

// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';

// const loginSchema = z.object({
//   email: z.string().trim().nonempty('Email must not be empty').email('Email is invalid'),
//   password: z.string().trim().nonempty('Password must not be empty'),
// });

// type LoginSchema = z.infer<typeof loginSchema>;

// function CardWithForm() {
//   const form = useForm({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   const onSubmit = (data: LoginSchema) => {
//     toast("You've submitted the following data", {
//       description: (
//         <pre className="mt-2 w-full rounded-lg bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     });
//   };

//   return (
//     <>
//       <Card className="w-[350px]">
//         <CardHeader>
//           <CardTitle>{cardTitle}</CardTitle>
//           <CardDescription>{cardDescription}</CardDescription>
//         </CardHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             <CardContent className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Username</FormLabel>
//                     <FormControl>
//                       <Input placeholder="code.mely@gmail.com" autoComplete="email" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" autoComplete="current-password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//             <CardFooter className="mt-4">
//               <Button type="submit" className="w-full">
//                 Sign in
//               </Button>
//             </CardFooter>
//           </form>
//         </Form>
//       </Card>
//       <Toaster />
//     </>
//   );
// }
// `,
//       },
//     },
//   },
// };

export const ImageHeader: Story = {
  name: '16:9 Image Header',
  render: (props) => (
    <Card className="w-[350px] overflow-hidden pt-0">
      <AspectRatio
        ratio={16 / 9} // 16:9 aspect ratio
        className="relative w-full"
      >
        <Image src="/code_mely_avatar.jpg" alt="" fill className="top-0 left-0 object-cover" />
      </AspectRatio>
      <CardHeader>
        <CardTitle>{props.cardTitle}</CardTitle>
        <CardDescription>{props.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.cardContent}</p>
      </CardContent>
      <CardFooter>
        <p>{props.cardFooter}</p>
      </CardFooter>
    </Card>
  ),
};

import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';

import { ScrollArea, ScrollBar } from '@/base/components/ui/scroll-area';
import { Separator } from '@/base/components/ui/separator';

type StoryProps = unknown;

const meta: Meta<StoryProps> = {
  title: 'Components/Utility Components/ScrollArea',
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
            <a href="https://ui.shadcn.com/docs/components/scroll-area" target="_blank">
              shadcn
            </a>
            , built on top of{' '}
            <a
              href="https://www.radix-ui.com/primitives/docs/components/scroll-area"
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
  name: 'ScrollArea',
  render: () => {
    const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

    return (
      <ScrollArea className="h-72 w-48 rounded-lg border">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
          {tags.map((tag) => (
            <>
              <div key={tag} className="text-sm">
                {tag}
              </div>
              <Separator className="my-2" />
            </>
          ))}
        </div>
      </ScrollArea>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => \`v1.2.0-beta.\${a.length - i}\`
)

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-lg border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}`,
      },
    },
  },
};

export const Horizontal: Story = {
  render: () => {
    const works = [
      {
        artist: 'Ornella Binni',
        art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
      },
      {
        artist: 'Tom Byrom',
        art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
      },
      {
        artist: 'Vladimir Malyavko',
        art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
      },
    ];

    return (
      <ScrollArea className="w-96 rounded-lg border whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4">
          {works.map((artwork) => (
            <figure key={artwork.artist} className="shrink-0">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={artwork.art}
                  alt={`Photo by ${artwork.artist}`}
                  className="aspect-[3/4] h-fit w-fit object-cover"
                  width={300}
                  height={400}
                />
              </div>
              <figcaption className="text-muted-foreground pt-2 text-xs">
                Photo by <span className="text-foreground font-semibold">{artwork.artist}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
import * as React from "react"
import Image from "next/image"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export interface Artwork {
  artist: string
  art: string
}

export const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
]

export function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-lg border">
      <div className="flex w-max space-x-4 p-4">
        {works.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={artwork.art}
                alt={\`Photo by \${artwork.artist}\`}
                className="aspect-[3/4] h-fit w-fit object-cover"
                width={300}
                height={400}
              />
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              Photo by{" "}
              <span className="font-semibold text-foreground">
                {artwork.artist}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
`,
      },
    },
  },
};

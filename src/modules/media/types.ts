import { z } from 'zod';

export const imagePayloadSchema = z.object({
  file: z.instanceof(File).nullable(),
  fileName: z.string().optional(),
  previewUrl: z.string(),
});

export type ImagePayload = z.infer<typeof imagePayloadSchema>;

export const imageResponseSchema = z.object({
  fileName: z.string(),
  url: z.string(),
});

export type ImageResponse = z.infer<typeof imageResponseSchema>;

export class VideoPayload {
  file: File | null = null;
  previewUrl!: string;
  thumbnailUrl!: string;
}

export type MediaUploadResponse = {
  data: [
    {
      originalName: string;
      name: string;
      url: string;
    },
  ];
  metadata: {
    successCount: number;
    failedCount: number;
  };
};

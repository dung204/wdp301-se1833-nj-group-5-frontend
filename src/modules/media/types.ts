export type ImagePayload = {
  file: File | null;
  fileName?: string;
  previewUrl: string;
};

export type ImageResponse = {
  fileName: string;
  url: string;
};

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

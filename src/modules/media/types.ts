export type ImagePayload = {
  file: File;
  previewUrl: string;
};

export type VideoPayload = {
  file: File;
  previewUrl: string;
  thumbnailUrl: string;
};

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

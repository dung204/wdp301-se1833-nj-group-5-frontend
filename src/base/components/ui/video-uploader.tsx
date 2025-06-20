'use client';

import { PlayCircleIcon, UploadIcon, VideoIcon, XIcon } from 'lucide-react';
import NextImage from 'next/image';
import { ComponentProps, DragEventHandler, useRef, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/base/lib';
import { ImageUtils } from '@/base/utils';
import { ImagePayload, VideoPayload } from '@/modules/media';

import { Badge } from './badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { LoadingIndicator } from './loading-indicator';

interface VideoUploaderProps
  extends Omit<ComponentProps<'input'>, 'type' | 'multiple' | 'accept' | 'onChange'> {
  videos?: VideoPayload[];
  onVideosChange?: (images: ImagePayload[]) => void;
}

export function VideoUploader({ className, videos, onVideosChange, ...props }: VideoUploaderProps) {
  const [isLoadingFromLocal, setIsUploadingFromLocal] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<VideoPayload[]>(videos ?? []);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>('');
  const [showPreviewVideoDialog, setShowPreviewVideoDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const Icon = getIcon(isDraggingOver, isLoadingFromLocal);

  const handleFileInputChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('File không đúng định dạng. Vui lòng tải lên file video');
      return;
    }

    if (file.size > ImageUtils.MAXIMUM_VIDEO_FILE_SIZE) {
      toast.error('Dung lượng file vượt quá 50MB');
      return;
    }

    setIsUploadingFromLocal(true);
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      const video = document.createElement('video');
      video.width = 360;
      video.height = 240;

      const canvas = document.createElement('canvas');
      video.width = 360;
      video.height = 240;

      const context = canvas.getContext('2d');
      const previewUrl = URL.createObjectURL(file);

      video.addEventListener('loadeddata', () => {
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg');

        setUploadedVideos((prev) => {
          const newUploadedVideos = [...prev, { file, previewUrl, thumbnailUrl }];
          onVideosChange?.(newUploadedVideos);

          return newUploadedVideos;
        });
        setIsUploadingFromLocal(false);
      });
      video.src = previewUrl;
    });
    fileReader.readAsDataURL(file);
  };

  const handleDragOver: DragEventHandler = (e) => {
    e.preventDefault();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave: DragEventHandler = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop: DragEventHandler = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    Array.from(e.dataTransfer.files).forEach(handleFileInputChange);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div
          className={cn(
            'group relative flex h-[300px] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-4 border-dashed border-transparent bg-slate-200 transition-all hover:border-blue-400',
            { 'border-blue-400': isDraggingOver },
            // className,
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <div
            className="absolute inset-0 z-50 h-full w-full bg-transparent"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
          <Icon
            className={cn(
              'h-24 w-24 opacity-50 transition-all select-none group-hover:text-blue-700 group-hover:opacity-100',
              { 'text-blue-700 opacity-100': isDraggingOver },
            )}
          />
          <h3
            className={cn('text-center text-lg opacity-50 select-none group-hover:opacity-100', {
              'opacity-100': isDraggingOver,
            })}
          >
            {getTitleText(isDraggingOver, isLoadingFromLocal)}
          </h3>
          <p
            className={cn('px-10 text-center text-sm opacity-40 group-hover:opacity-70', {
              'opacity-70': isDraggingOver,
            })}
          >
            Một video phải có dung lượng không vượt quá 50MB
          </p>
        </div>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          accept="video/*"
          className="hidden"
          onChange={(e) => Array.from(e.target.files ?? []).forEach(handleFileInputChange)}
          {...props}
        />
        <div className="flex flex-wrap gap-6">
          {uploadedVideos.map((video, index) => (
            <div
              className="group relative aspect-square size-20 cursor-pointer select-none"
              key={`image_upload_${crypto.randomUUID()}`}
            >
              <Badge
                variant="danger"
                className="absolute top-0 right-0 z-50 translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5"
                onClick={() => {
                  const newUploadedVideos = uploadedVideos.filter((_, idx) => idx !== index);
                  URL.revokeObjectURL(video.previewUrl);
                  onVideosChange?.(newUploadedVideos);
                  setUploadedVideos(newUploadedVideos);
                }}
              >
                <XIcon />
              </Badge>
              <div
                className="absolute inset-0 z-40 flex size-full items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => {
                  setPreviewVideoUrl(video.previewUrl);
                  setShowPreviewVideoDialog(true);
                }}
              >
                <PlayCircleIcon className="text-white" />
              </div>
              <NextImage
                src={video.thumbnailUrl}
                alt=""
                fill
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
      <PreviewVideoDialog
        previewUrl={previewVideoUrl}
        open={showPreviewVideoDialog}
        onOpenChange={setShowPreviewVideoDialog}
      />
    </>
  );
}

function getTitleText(isDraggingOver: boolean, isUploadingFromLocal: boolean) {
  if (isUploadingFromLocal) return 'Đang tải lên...';

  return isDraggingOver ? 'Thả để tải lên' : 'Nhấn hoặc kéo video vào đây để tải lên';
}

function getIcon(isDraggingOver: boolean, isUploadingFromLocal: boolean) {
  if (isUploadingFromLocal) return LoadingIndicator;

  return isDraggingOver ? UploadIcon : VideoIcon;
}

interface PreviewVideoDialogProps extends ComponentProps<typeof Dialog> {
  previewUrl: string;
}

function PreviewVideoDialog({ previewUrl, onOpenChange, ...props }: PreviewVideoDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    onOpenChange?.(open);
  };

  return (
    <Dialog onOpenChange={handleOpenChange} {...props}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Xem trước video</DialogTitle>
          <div className="relative flex h-[70vh] items-center justify-center">
            <video ref={videoRef} controls autoPlay className="size-full">
              <source src={previewUrl} />
            </video>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

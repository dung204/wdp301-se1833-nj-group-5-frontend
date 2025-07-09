'use client';

import { EyeIcon, ImageIcon, PlusIcon, Trash2Icon, UploadIcon, XIcon } from 'lucide-react';
import NextImage from 'next/image';
import { ComponentProps, DragEventHandler, useRef, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/base/lib';
import { ImageUtils } from '@/base/utils';
import { ImagePayload } from '@/modules/media';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import { Badge } from './badge';
import { buttonVariantsFn } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { LoadingIndicator } from './loading-indicator';

interface ImageUploaderProps
  extends Omit<ComponentProps<'input'>, 'type' | 'multiple' | 'accept' | 'onChange'> {
  images?: ImagePayload[];
  onImagesChange?: (images: ImagePayload[]) => void;
  fileNamesToDelete?: string[];
  onFileNamesToDeleteChange?: (fileNames: string[]) => void;
}

export function ImageUploader({
  className,
  images,
  onImagesChange,
  fileNamesToDelete: initialFileNamesToDelete,
  onFileNamesToDeleteChange,
  ...props
}: ImageUploaderProps) {
  const [isLoadingFromLocal, setIsUploadingFromLocal] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ImagePayload[]>(images ?? []);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [showPreviewImageDialog, setShowPreviewImageDialog] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImagePayload | undefined>();
  const [fileNamesToDelete, setFileNamesToDelete] = useState<string[]>(
    initialFileNamesToDelete ?? [],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const Icon = getIcon(isDraggingOver, isLoadingFromLocal);

  const handleFileInputChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File không đúng định dạng. Vui lòng tải lên file ảnh');
      return;
    }

    if (file.size > ImageUtils.MAXIMUM_IMAGE_FILE_SIZE) {
      toast.error('Dung lượng file vượt quá 10MB');
      return;
    }

    setIsUploadingFromLocal(true);
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      const previewImageElem = new Image();
      const previewUrl = fileReader.result?.toString() || '';

      previewImageElem.addEventListener('load', (e) => {
        const { src } = e.currentTarget as HTMLImageElement;

        setUploadedImages((prev) => {
          const newUploadedImages = [
            ...prev,
            {
              file,
              previewUrl: src,
            },
          ];
          onImagesChange?.(newUploadedImages);

          return newUploadedImages;
        });
      });
      setIsUploadingFromLocal(false);
      previewImageElem.src = previewUrl;
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

  const handleRemoveImage = (image: ImagePayload, index: number) => {
    // If the image is not uploaded from device (i.e., it is a local file), show the delete dialog
    if (!image?.file) {
      setImageToDelete(image);
      setShowDeleteDialog(true);
      return;
    }

    const newUploadedImages = uploadedImages.filter((_, idx) => idx !== index);
    onImagesChange?.(newUploadedImages);
    setUploadedImages(newUploadedImages);
  };

  const handleRestoreImage = (fileName: string) => {
    const newFileNamesToDelete = fileNamesToDelete.filter((name) => name !== fileName);
    setFileNamesToDelete(newFileNamesToDelete);
    onFileNamesToDeleteChange?.(newFileNamesToDelete);
    setImageToDelete(undefined);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div
          className={cn(
            'group relative flex h-[300px] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-4 border-dashed border-transparent bg-slate-200 transition-all hover:border-blue-400',
            { 'border-blue-400': isDraggingOver },
            className,
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
            Một bức ảnh phải có dung lượng không vượt quá 10MB
          </p>
        </div>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => Array.from(e.target.files ?? []).forEach(handleFileInputChange)}
          {...props}
        />
        {uploadedImages.length !== 0 && (
          <div className="flex flex-wrap gap-6">
            {uploadedImages.map((image, index) => (
              <div
                className="group relative aspect-square size-20 cursor-pointer select-none"
                key={`image_upload_${crypto.randomUUID()}`}
              >
                <Badge
                  variant={fileNamesToDelete.includes(image.fileName ?? '') ? 'success' : 'danger'}
                  className="absolute top-0 right-0 z-50 translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5"
                  onClick={() =>
                    fileNamesToDelete.includes(image.fileName ?? '')
                      ? handleRestoreImage(image.fileName ?? '')
                      : handleRemoveImage(image, index)
                  }
                >
                  {fileNamesToDelete.includes(image.fileName ?? '') ? <PlusIcon /> : <XIcon />}
                </Badge>
                <div
                  className={cn(
                    'absolute inset-0 z-40 flex size-full items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100',
                    {
                      'bg-white/25 opacity-100': fileNamesToDelete.includes(image.fileName ?? ''),
                    },
                  )}
                  onClick={() => {
                    setPreviewImageUrl(image.previewUrl);
                    setShowPreviewImageDialog(true);
                  }}
                >
                  {fileNamesToDelete.includes(image.fileName ?? '') ? (
                    <Trash2Icon className="text-danger" />
                  ) : (
                    <EyeIcon className="text-white" />
                  )}
                </div>
                <NextImage
                  src={image.previewUrl}
                  alt=""
                  fill
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <PreviewImageDialog
        previewUrl={previewImageUrl}
        open={showPreviewImageDialog}
        onOpenChange={setShowPreviewImageDialog}
      />
      <ConfirmDeleteImageDialog
        image={imageToDelete}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={(fileName) => {
          if (!fileName) return;
          const newFileNamesToDelete = [...fileNamesToDelete, fileName];
          setFileNamesToDelete(newFileNamesToDelete);
          onFileNamesToDeleteChange?.(newFileNamesToDelete);
        }}
      />
    </>
  );
}

function getTitleText(isDraggingOver: boolean, isUploadingFromLocal: boolean) {
  if (isUploadingFromLocal) return 'Đang tải lên...';

  return isDraggingOver ? 'Thả để tải lên' : 'Nhấn hoặc kéo ảnh vào đây để tải lên';
}

function getIcon(isDraggingOver: boolean, isUploadingFromLocal: boolean) {
  if (isUploadingFromLocal) return LoadingIndicator;

  return isDraggingOver ? UploadIcon : ImageIcon;
}

interface PreviewImageDialogProps extends ComponentProps<typeof Dialog> {
  previewUrl: string;
}

function PreviewImageDialog({ previewUrl, ...props }: PreviewImageDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Xem trước ảnh</DialogTitle>
          <div className="relative h-[70vh]">
            <NextImage src={previewUrl} alt="" fill className="object-contain object-center" />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmDeleteImageDialogProps extends ComponentProps<typeof AlertDialog> {
  image?: ImagePayload;
  onConfirm?: (fileName: string) => void;
}

function ConfirmDeleteImageDialog({
  image,
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteImageDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn muốn xóa ảnh này?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ đánh dấu để xóa ảnh này khi bạn lưu thông tin. Bạn có thể nhấn vào nút
            &quot;+&quot; để bỏ đánh dấu xóa ảnh này.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm?.(image?.fileName ?? '')}
            className={buttonVariantsFn({ variant: 'danger' })}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

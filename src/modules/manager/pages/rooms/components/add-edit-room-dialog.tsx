// import { Button } from "@/base/components/ui/button"
// import { Input } from "@/base/components/ui/input"
// import { Label } from "@/base/components/ui/label"
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/base/components/ui/dialog"
// import { Edit, Loader2, Plus } from "lucide-react"
// import { CreateRoomSchema } from "@/modules/manager/services/room.service"
// interface AddEditRoomDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   formMode: "add" | "edit"
//   roomFormData: CreateRoomSchema
//   setRoomFormData: (data: CreateRoomSchema) => void
//   onSubmit: () => void
//   isPending: boolean
//   hotels: { id: string; name: string }[]
// }
// const AVAILABLE_SERVICES = [
//   "WiFi",
//   "Minibar",
//   "TV",
//   "Điều hòa",
//   "Máy sấy tóc",
//   "Bồn tắm",
//   "Bàn làm việc",
// ];
// export function AddEditRoomDialog({
//   open,
//   onOpenChange,
//   formMode,
//   roomFormData,
//   setRoomFormData,
//   onSubmit,
//   isPending,
//   hotels,
// }: AddEditRoomDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             {formMode === "add" ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
//             {formMode === "add" ? "Thêm phòng mới" : "Chỉnh sửa phòng"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="hotel">Khách sạn *</Label>
//             <select
//               id="hotel"
//               className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
//               value={roomFormData.hotel}
//               onChange={e => setRoomFormData({ ...roomFormData, hotel: e.target.value })}
//               required
//             >
//               <option value="">Chọn khách sạn</option>
//               {hotels.map(hotel => (
//                 <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
//               ))}
//             </select>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="name">Tên phòng *</Label>
//             <Input
//               id="name"
//               value={roomFormData.name}
//               onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
//               placeholder="Nhập tên phòng"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="rate">Giá phòng *</Label>
//             <Input
//               id="rate"
//               type="string"
//               value={roomFormData.rate}
//               onChange={(e) => setRoomFormData({ ...roomFormData, rate: Number(e.target.value) })}
//               placeholder="Nhập giá phòng"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="size">Diện tích (m²) *</Label>
//             <Input
//               id="size"
//               type="string"
//               value={roomFormData.size}
//               onChange={(e) => setRoomFormData({ ...roomFormData, size: Number(e.target.value) })}
//               placeholder="Nhập diện tích"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="occupancy">Số người tối đa *</Label>
//             <Input
//               id="occupancy"
//               type="string"
//               value={roomFormData.occupancy}
//               onChange={(e) => setRoomFormData({ ...roomFormData, occupancy: Number(e.target.value) })}
//               placeholder="Nhập số người tối đa"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="maxQuantity">Số lượng phòng *</Label>
//             <Input
//               id="maxQuantity"
//               type="string"
//               value={roomFormData.maxQuantity}
//               onChange={(e) => setRoomFormData({ ...roomFormData, maxQuantity: Number(e.target.value) })}
//               placeholder="Nhập số lượng phòng"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Dịch vụ *</Label>
//             <div className="grid grid-cols-2 gap-2">
//               {AVAILABLE_SERVICES.map((service) => (
//                 <label key={service} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={roomFormData.services?.includes(service) || false}
//                     onChange={(e) => {
//                       const isChecked = e.target.checked;
//                       const newServices = isChecked
//                         ? [...(roomFormData.services || []), service]
//                         : (roomFormData.services || []).filter((s) => s !== service);
//                       setRoomFormData({
//                         ...roomFormData,
//                         services: newServices,
//                       });
//                     }}
//                   />
//                   <span>{service}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="images">Ảnh (URL, phân cách bởi dấu phẩy)</Label>
//             <Input
//               id="images"
//               value={roomFormData.images?.join(", ") || ""}
//               onChange={(e) =>
//                 setRoomFormData({
//                   ...roomFormData,
//                   images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
//                 })
//               }
//               placeholder="https://example.com/room1.jpg, https://example.com/room2.jpg"
//             />
//           </div>
//         </div>
//         <DialogFooter className="gap-2">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Hủy
//           </Button>
//           <Button
//             onClick={onSubmit}
//             disabled={isPending}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             {isPending ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Đang xử lý...
//               </>
//             ) : formMode === "add" ? (
//               "Thêm phòng"
//             ) : (
//               "Lưu thay đổi"
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
import { Edit, Loader2, Plus } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/base/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';
import { Form } from '@/base/components/ui/form';
import { createRoomSchema } from '@/modules/manager/services/room.service';

// export const CreateRoomSchema = z.object({
//   hotel: z.string().min(1, "Vui lòng chọn khách sạn"),
//   name: z.string().min(1, "Tên phòng không được bỏ trống"),
//   rate: z.number().min(1, "Giá phòng phải lớn hơn 0"),
//   size: z.number().min(1, "Diện tích phải lớn hơn 0"),
//   occupancy: z.number().min(1, "Số người tối đa phải lớn hơn 0"),
//   maxQuantity: z.number().min(1, "Số lượng phòng phải lớn hơn 0"),
//   services: z.array(z.string()).optional(),
//   images: z.array(z.string()).optional(),
// })

interface AddEditRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formMode: 'add' | 'edit';
  defaultValues: z.infer<typeof createRoomSchema>;
  onSubmit: (values: z.infer<typeof createRoomSchema>) => void;
  isPending: boolean;
  hotels: { id: string; name: string }[];
}

const AVAILABLE_SERVICES = [
  'WiFi',
  'Minibar',
  'TV',
  'Điều hòa',
  'Máy sấy tóc',
  'Bồn tắm',
  'Bàn làm việc',
];

export function AddEditRoomDialog({
  open,
  onOpenChange,
  formMode,
  defaultValues,
  onSubmit,
  isPending,
  hotels,
}: AddEditRoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formMode === 'add' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            {formMode === 'add' ? 'Thêm phòng mới' : 'Chỉnh sửa phòng'}
          </DialogTitle>
        </DialogHeader>

        <Form
          schema={createRoomSchema}
          defaultValues={defaultValues}
          className="space-y-4"
          fields={[
            {
              name: 'hotel',
              type: 'select',
              label: 'Khách sạn *',
              options: [
                { label: 'Chọn khách sạn', value: '' },
                ...hotels.map((h) => ({ label: h.name, value: h.id })),
              ],
              disabled: isPending,
            },
            {
              name: 'name',
              type: 'text',
              label: 'Tên phòng *',
              placeholder: 'Nhập tên phòng',
              disabled: isPending,
            },
            {
              name: 'rate',
              type: 'text',
              label: 'Giá phòng *',
              placeholder: 'Nhập giá phòng',
              disabled: isPending,
            },
            {
              name: 'size',
              type: 'text',
              label: 'Diện tích (m²) *',
              placeholder: 'Nhập diện tích',
              disabled: isPending,
            },
            {
              name: 'occupancy',
              type: 'text',
              label: 'Số người tối đa *',
              placeholder: 'Nhập số người tối đa',
              disabled: isPending,
            },
            {
              name: 'maxQuantity',
              type: 'text',
              label: 'Số lượng phòng *',
              placeholder: 'Nhập số lượng phòng',
              disabled: isPending,
            },
            {
              name: 'services',
              type: 'select',
              label: 'Dịch vụ *',
              options: AVAILABLE_SERVICES.map((s) => ({ label: s, value: s })),
              disabled: isPending,
            },
            {
              name: 'images',
              type: 'text',
              label: 'Ảnh (URL, phân cách bởi dấu phẩy)',
              placeholder: 'https://example.com/room1.jpg, https://example.com/room2.jpg',
              // transform: (value: string) => value.split(",").map(s => s.trim()).filter(Boolean),
              disabled: isPending,
            },
          ]}
          onSuccessSubmit={onSubmit}
          renderSubmitButton={(SubmitButton) => (
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Hủy
              </Button>
              <SubmitButton className="bg-blue-600 hover:bg-blue-700" aria-disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : formMode === 'add' ? (
                  'Thêm phòng'
                ) : (
                  'Lưu thay đổi'
                )}
              </SubmitButton>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

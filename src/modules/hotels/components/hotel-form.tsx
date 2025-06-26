import { ComponentProps } from 'react';

import { Form } from '@/base/components/ui/form';

import { cancelPolicies, createHotelSchema } from '../types';

type HotelFormProps = Omit<ComponentProps<typeof Form>, 'schema' | 'fields'>;

export function HotelForm(props: HotelFormProps) {
  return (
    <Form
      schema={createHotelSchema}
      fields={[
        {
          name: 'name',
          type: 'text',
          label: 'Tên khách sạn',
          placeholder: 'Nhập tên khách sạn',
        },
        {
          name: 'address',
          type: 'text',
          label: 'Địa chỉ khách sạn',
          placeholder: 'Nhập địa chỉ khách sạn',
        },
        {
          name: 'phoneNumber',
          type: 'text',
          label: 'Số điện thoại',
          placeholder: 'Nhập số điện thoại liên hệ',
        },
        {
          name: 'priceHotel',
          type: 'text',
          label: 'Giá tiền',
          placeholder: 'Nhập giá tiền',
        },
        {
          name: 'checkinTime',
          type: 'time',
          range: true,
          label: 'Thời gian nhận phòng',
          placeholder: 'Chọn thời gian nhận phòng',
        },
        {
          name: 'checkoutTime',
          type: 'time',
          label: 'Thời gian trả phòng',
          placeholder: 'Chọn thời gian trả phòng',
        },
        {
          name: 'cancelPolicy',
          type: 'select',
          label: 'Chính sách hủy phòng',
          placeholder: 'Chọn chính sách hủy phòng',
          searchable: false,
          clearable: false,
          options: Object.entries(cancelPolicies).map(([value, label]) => ({
            value,
            label,
          })),
        },
        {
          name: 'rating',
          type: 'rating',
          label: 'Đánh giá',
          render: ({ Control, Description, Label, Message }) => (
            <>
              <div className="flex items-center gap-2">
                <Label />
                <Control />
              </div>
              <Description />
              <Message />
            </>
          ),
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả',
          placeholder: 'Nhập mô tả về khách sạn',
        },
      ]}
      {...props}
    />
  );
}

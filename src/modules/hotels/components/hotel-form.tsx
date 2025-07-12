'use client';

import { ComponentProps, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Form } from '@/base/components/ui/form';

import { useAddressData } from '../hooks/use-address-data';
import { cancelPolicies, createHotelSchema } from '../types';

type HotelFormProps = Omit<ComponentProps<typeof Form>, 'schema' | 'fields'>;

export function HotelForm(props: HotelFormProps) {
  const { provinces, communes, loadingProvinces, loadingCommunes, fetchCommunes, clearCommunes } =
    useAddressData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<UseFormReturn<any>>(null);

  return (
    <Form
      ref={formRef}
      schema={createHotelSchema}
      fields={[
        {
          name: 'name',
          type: 'text',
          label: 'Tên khách sạn',
          placeholder: 'Nhập tên khách sạn',
        },
        {
          name: 'province',
          type: 'select',
          label: 'Tỉnh/Thành phố',
          placeholder: loadingProvinces ? 'Đang tải...' : '-- Chọn tỉnh/thành --',
          clearable: false,
          searchable: true,
          disabled: loadingProvinces,
          options: provinces.map((province) => ({
            value: province.code,
            label: province.name,
          })),
          onChange: (value: string | string[]) => {
            if (typeof value === 'string') {
              // Find the selected province to get its name
              const selectedProvince = provinces.find((p) => p.code === value);

              // Store the province name in the form instead of the code
              if (selectedProvince && formRef.current) {
                formRef.current.setValue('province', selectedProvince.name, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }

              clearCommunes();
              fetchCommunes(value);
            }
          },
        },
        {
          name: 'commune',
          type: 'select',
          label: 'Xã/Phường',
          placeholder: loadingCommunes
            ? 'Đang tải...'
            : communes.length === 0
              ? '-- Chọn tỉnh/thành trước --'
              : '-- Chọn xã/phường --',
          clearable: false,
          searchable: true,
          disabled: loadingCommunes,
          options: communes.map((commune) => ({
            value: commune.code,
            label: commune.name,
          })),
          onChange: (value: string | string[]) => {
            if (typeof value === 'string') {
              // Find the selected commune to get its name
              const selectedCommune = communes.find((c) => c.code === value);

              // Store the commune name in the form instead of the code
              if (selectedCommune && formRef.current) {
                formRef.current.setValue('commune', selectedCommune.name, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }
            }
          },
        },
        {
          name: 'address',
          type: 'text',
          label: 'Địa chỉ chi tiết',
          placeholder: 'Nhập địa chỉ chi tiết (số nhà, tên đường...)',
        },
        {
          name: 'phoneNumber',
          type: 'text',
          label: 'Số điện thoại',
          placeholder: 'Nhập số điện thoại (VD: 0901234567)',
        },
        {
          name: 'priceHotel',
          type: 'text',
          label: 'Giá tiền (VND)',
          placeholder: 'Nhập giá tiền (tối thiểu 1,000 VND)',
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
          label: 'Xếp hạng',
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
        {
          name: 'images',
          type: 'image',
          label: 'Ảnh khách sạn',
          render: ({ Label, Control, Message }) => (
            <>
              <Label />
              <Control />
              <Message />
            </>
          ),
        },
      ]}
      {...props}
    />
  );
}

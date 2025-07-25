'use client';

import { ComponentProps, useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Form } from '@/base/components/ui/form';
import { Select } from '@/base/components/ui/select';

import { useAddressData } from '../hooks/use-address-data';
import { cancelPolicies, createHotelSchema } from '../types';

type HotelFormProps = Omit<ComponentProps<typeof Form>, 'schema' | 'fields'>;

export function HotelForm(props: HotelFormProps) {
  const { provinces, communes, loadingProvinces, loadingCommunes, fetchCommunes, clearCommunes } =
    useAddressData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<UseFormReturn<any>>(null);

  // Controlled state for select values (codes for display, names for form)
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('');
  const [selectedCommuneCode, setSelectedCommuneCode] = useState<string>('');
  const [initialized, setInitialized] = useState(false);

  // Initialize province and commune codes based on form default values only once
  useEffect(() => {
    if (!initialized && props.defaultValues && provinces.length > 0) {
      const provinceName = props.defaultValues.province;
      if (provinceName) {
        const province = provinces.find((p) => p.name === provinceName);
        if (province) {
          setSelectedProvinceCode(province.code);
          fetchCommunes(province.code);
        }
      }
      setInitialized(true);
    }
  }, [provinces, props.defaultValues, fetchCommunes, initialized]);

  // Initialize commune code based on form default values only once when communes are loaded
  useEffect(() => {
    if (initialized && props.defaultValues && communes.length > 0 && !selectedCommuneCode) {
      const communeName = props.defaultValues.commune;
      if (communeName) {
        const commune = communes.find((c) => c.name === communeName);
        if (commune) {
          setSelectedCommuneCode(commune.code);
        }
      }
    }
  }, [communes, props.defaultValues, initialized, selectedCommuneCode]);

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
          async: false,
          options: [], // Empty array since we handle options in render
          render: ({ Label, Description, Message }) => (
            <>
              <Label />
              <Select
                value={selectedProvinceCode} // Use controlled value (code)
                options={provinces.map((province) => ({
                  value: province.code,
                  label: province.name,
                }))}
                placeholder={loadingProvinces ? 'Đang tải...' : '-- Chọn tỉnh/thành --'}
                clearable={false}
                searchable={true}
                disabled={loadingProvinces}
                onChange={(value: string | undefined) => {
                  if (typeof value === 'string') {
                    // Update controlled state
                    setSelectedProvinceCode(value);

                    // Find the selected province to get its name
                    const selectedProvince = provinces.find((p) => p.code === value);

                    // Store the province name in the form (backend expects names)
                    if (selectedProvince && formRef.current) {
                      formRef.current.setValue('province', selectedProvince.name, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }

                    // Clear commune selection and fetch new communes
                    setSelectedCommuneCode('');
                    clearCommunes();
                    fetchCommunes(value);
                  }
                }}
              />
              <Description />
              <Message />
            </>
          ),
        },
        {
          name: 'commune',
          type: 'select',
          label: 'Xã/Phường',
          async: false,
          options: [], // Empty array since we handle options in render
          render: ({ Label, Description, Message }) => (
            <>
              <Label />
              <Select
                value={selectedCommuneCode} // Use controlled value (code)
                options={communes.map((commune) => ({
                  value: commune.code,
                  label: commune.name,
                }))}
                placeholder={
                  loadingCommunes
                    ? 'Đang tải...'
                    : communes.length === 0
                      ? '-- Chọn tỉnh/thành trước --'
                      : '-- Chọn xã/phường --'
                }
                clearable={false}
                searchable={true}
                disabled={loadingCommunes}
                onChange={(value: string | undefined) => {
                  if (typeof value === 'string') {
                    // Update controlled state
                    setSelectedCommuneCode(value);

                    // Find the selected commune to get its name
                    const selectedCommune = communes.find((c) => c.code === value);

                    // Store the commune name in the form (backend expects names)
                    if (selectedCommune && formRef.current) {
                      formRef.current.setValue('commune', selectedCommune.name, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }
                  }
                }}
              />
              <Description />
              <Message />
            </>
          ),
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

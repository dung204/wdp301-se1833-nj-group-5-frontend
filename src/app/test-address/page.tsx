'use client';

import { useState } from 'react';

import { useAddressData } from '@/modules/hotels/hooks/use-address-data';

// Fixed client component directive
export default function AddressTestPage() {
  const { provinces, communes, loadingProvinces, loadingCommunes, fetchCommunes, clearCommunes } =
    useAddressData();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');

  const handleProvinceChange = (provinceCode: string) => {
    console.warn('Province selected:', provinceCode);
    setSelectedProvince(provinceCode);
    setSelectedCommune('');
    clearCommunes();
    if (provinceCode) {
      fetchCommunes(provinceCode);
    }
  };

  const handleCommuneChange = (communeCode: string) => {
    console.warn('Commune selected:', communeCode);
    setSelectedCommune(communeCode);
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Address Selection Test</h1>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Tỉnh/Thành phố ({provinces.length} tỉnh/thành)
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => handleProvinceChange(e.target.value)}
            disabled={loadingProvinces}
            className="w-full rounded-md border border-gray-300 p-2"
            title="Chọn tỉnh/thành phố"
          >
            <option value="">{loadingProvinces ? 'Đang tải...' : '-- Chọn tỉnh/thành --'}</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Xã/Phường ({communes.length} xã/phường)
          </label>
          <select
            value={selectedCommune}
            onChange={(e) => handleCommuneChange(e.target.value)}
            disabled={loadingCommunes}
            className="w-full rounded-md border border-gray-300 p-2"
            title="Chọn xã/phường"
          >
            <option value="">
              {loadingCommunes
                ? 'Đang tải...'
                : communes.length === 0
                  ? '-- Chọn tỉnh/thành trước --'
                  : '-- Chọn xã/phường --'}
            </option>
            {communes.map((commune) => (
              <option key={commune.code} value={commune.code}>
                {commune.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 rounded-md bg-gray-100 p-4">
          <h3 className="mb-2 font-medium">Debug Info:</h3>
          <pre className="text-sm">
            {JSON.stringify(
              {
                loadingProvinces,
                loadingCommunes,
                provincesCount: provinces.length,
                communesCount: communes.length,
                selectedProvince,
                selectedCommune,
              },
              null,
              2,
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}

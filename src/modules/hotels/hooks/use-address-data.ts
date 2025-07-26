import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Commune, Province, addressService } from '../services/address.service';

export function useAddressData() {
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('');

  const {
    data: provinces = [],
    isLoading: loadingProvinces,
    error: provincesError,
  } = useQuery<Province[]>({
    queryKey: ['provinces'],
    queryFn: () => addressService.getProvinces(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: communes = [],
    isLoading: loadingCommunes,
    error: communesError,
  } = useQuery<Commune[]>({
    queryKey: ['communes', selectedProvinceCode],
    queryFn: () => addressService.getCommunes(selectedProvinceCode),
    enabled: !!selectedProvinceCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const fetchCommunes = (provinceCode: string) => {
    setSelectedProvinceCode(provinceCode);
  };

  const clearCommunes = () => {
    setSelectedProvinceCode('');
  };

  return {
    provinces,
    communes,
    loadingProvinces,
    loadingCommunes,
    fetchCommunes,
    clearCommunes,
    provincesError,
    communesError,
  };
}

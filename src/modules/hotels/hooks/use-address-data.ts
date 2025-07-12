import { useEffect, useState } from 'react';

import { Commune, Province, addressService } from '../services/address.service';

export function useAddressData() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingCommunes, setLoadingCommunes] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await addressService.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  const fetchCommunes = async (provinceCode: string) => {
    if (!provinceCode) {
      setCommunes([]);
      return;
    }

    setLoadingCommunes(true);
    try {
      const data = await addressService.getCommunes(provinceCode);
      setCommunes(data);
    } catch (error) {
      console.error('Error fetching communes:', error);
      setCommunes([]);
    } finally {
      setLoadingCommunes(false);
    }
  };

  const clearCommunes = () => {
    setCommunes([]);
  };

  return {
    provinces,
    communes,
    loadingProvinces,
    loadingCommunes,
    fetchCommunes,
    clearCommunes,
  };
}

export interface Province {
  code: string;
  name: string;
  englishName: string;
  administrativeLevel: string;
  decree: string;
}

export interface Commune {
  code: string;
  name: string;
  englishName: string;
  administrativeLevel: string;
  provinceCode: string;
  provinceName: string;
  decree: string;
}

interface ProvinceResponse {
  requestId: string;
  provinces: Province[];
}

interface CommuneResponse {
  requestId: string;
  communes: Commune[];
}

class AddressService {
  private baseUrl = '/api/address'; // Use local API routes instead of external API

  public async getProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${this.baseUrl}/provinces`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch provinces: ${response.status} ${response.statusText}`);
      }

      const data: ProvinceResponse = await response.json();
      return data.provinces || [];
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return this.getFallbackProvinces();
    }
  }

  public async getCommunes(provinceCode: string): Promise<Commune[]> {
    try {
      const response = await fetch(`${this.baseUrl}/communes/${provinceCode}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch communes: ${response.status} ${response.statusText}`);
      }

      const data: CommuneResponse = await response.json();
      return data.communes || [];
    } catch (error) {
      console.error('Error fetching communes:', error);
      return this.getFallbackCommunes(provinceCode);
    }
  }

  private getFallbackProvinces(): Province[] {
    return [
      {
        code: '01',
        name: 'Thành phố Hà Nội',
        englishName: 'Hanoi',
        administrativeLevel: 'Thành phố Trung ương',
        decree: '',
      },
      {
        code: '79',
        name: 'Thành phố Hồ Chí Minh',
        englishName: 'Ho Chi Minh City',
        administrativeLevel: 'Thành phố Trung ương',
        decree: '',
      },
      {
        code: '48',
        name: 'Thành phố Đà Nẵng',
        englishName: 'Da Nang',
        administrativeLevel: 'Thành phố Trung ương',
        decree: '',
      },
      {
        code: '31',
        name: 'Thành phố Hải Phòng',
        englishName: 'Hai Phong',
        administrativeLevel: 'Thành phố Trung ương',
        decree: '',
      },
      {
        code: '92',
        name: 'Thành phố Cần Thơ',
        englishName: 'Can Tho',
        administrativeLevel: 'Thành phố Trung ương',
        decree: '',
      },
    ];
  }

  private getFallbackCommunes(provinceCode: string): Commune[] {
    const commonCommunes: Record<string, Commune[]> = {
      '01': [
        // Hà Nội
        {
          code: '00001',
          name: 'Phường Phúc Xá',
          englishName: 'Phuc Xa Ward',
          administrativeLevel: 'Phường',
          provinceCode: '01',
          provinceName: 'Thành phố Hà Nội',
          decree: '',
        },
        {
          code: '00004',
          name: 'Phường Trúc Bạch',
          englishName: 'Truc Bach Ward',
          administrativeLevel: 'Phường',
          provinceCode: '01',
          provinceName: 'Thành phố Hà Nội',
          decree: '',
        },
      ],
      '79': [
        // TP HCM
        {
          code: '26734',
          name: 'Phường Bến Nghé',
          englishName: 'Ben Nghe Ward',
          administrativeLevel: 'Phường',
          provinceCode: '79',
          provinceName: 'Thành phố Hồ Chí Minh',
          decree: '',
        },
        {
          code: '26737',
          name: 'Phường Bến Thành',
          englishName: 'Ben Thanh Ward',
          administrativeLevel: 'Phường',
          provinceCode: '79',
          provinceName: 'Thành phố Hồ Chí Minh',
          decree: '',
        },
      ],
    };

    return commonCommunes[provinceCode] || [];
  }
}

export const addressService = new AddressService();

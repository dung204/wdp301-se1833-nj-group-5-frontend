import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://production.cas.so/address-kit/2025-07-01/provinces', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch provinces: ${response.status}`);
    }

    const data = await response.json();

    // Filter out the summary entry (empty code)
    const filteredProvinces =
      data.provinces?.filter(
        (province: { code?: string }) => province.code && province.code.trim() !== '',
      ) || [];

    return NextResponse.json({
      provinces: filteredProvinces,
    });
  } catch (error) {
    console.error('Error fetching provinces:', error);

    // Return fallback data
    const fallbackProvinces = [
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

    return NextResponse.json({
      provinces: fallbackProvinces,
    });
  }
}

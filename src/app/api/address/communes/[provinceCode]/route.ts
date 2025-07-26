import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ provinceCode: string }> },
) {
  try {
    const { provinceCode } = await params;

    if (!provinceCode) {
      return NextResponse.json({ error: 'Province code is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://production.cas.so/address-kit/2025-07-01/provinces/${provinceCode}/communes`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch communes: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      communes: data.communes || [],
    });
  } catch (error) {
    console.error('Error fetching communes:', error);

    // Return fallback data for major cities
    const fallbackCommunes: Record<
      string,
      Array<{
        code: string;
        name: string;
        englishName: string;
        administrativeLevel: string;
        provinceCode: string;
        provinceName: string;
        decree: string;
      }>
    > = {
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

    const { provinceCode } = await params;
    return NextResponse.json({
      communes: fallbackCommunes[provinceCode] || [],
    });
  }
}

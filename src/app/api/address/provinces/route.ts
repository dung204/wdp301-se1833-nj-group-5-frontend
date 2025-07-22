import Fuse from 'fuse.js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = await fetch('https://production.cas.so/address-kit/2025-07-01/provinces', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const { provinces } = await response.json();

    if (name) {
      const fuse = new Fuse(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provinces.map((province: any) => ({
          ...province,
          name: province.name.replaceAll(/(Tỉnh|Thành phố)/g, '').trim(),
        })),
        {
          ignoreLocation: true,
          isCaseSensitive: false,
          ignoreDiacritics: true,
          includeScore: true,
          shouldSort: true,
          keys: ['name'],
        },
      );
      const searchResult = fuse.search(name);

      return NextResponse.json({
        provinces: searchResult.map((province) => province.item),
      });
    }

    return NextResponse.json({
      provinces,
    });
  }

  return response;
}

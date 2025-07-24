import { AsyncSelectProps } from '@/base/components/ui/async-select';
import { CommonSearchParams } from '@/base/types';

import { hotelsService } from '../services/hotels.service';
import { Hotel, ManagerHotelSearchParams } from '../types';

export class HotelUtils {
  static DEFAULT_MIN_PRICE = 0;
  static DEFAULT_MAX_PRICE = 500_000_000;

  static getHotelsByAdminAsyncSelectOptions(
    searchBy: Exclude<keyof ManagerHotelSearchParams, keyof CommonSearchParams | 'sorting'>,
  ): Omit<AsyncSelectProps<Hotel>, 'value' | 'onChange'> {
    return {
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: (searchTerm) =>
        !searchTerm
          ? ['hotels', 'admin', 'all']
          : ['hotels', 'admin', 'all', { [searchBy]: searchTerm }],
      queryFn: (searchTerm, page) =>
        hotelsService.getHotelByAdmin({ [searchBy]: searchTerm, page }),
      getDisplayValue: (hotel) => hotel.name,
      getOptionValue: (hotel) => hotel.id,
      placeholder: 'Chọn khách sạn...',
      label: 'Khách sạn',
      renderOption: (location) => <div>{location.name}</div>,
      notFound: <div className="pt-2 text-center text-sm">Không tìm thấy khách sạn</div>,
      clearable: true,
    };
  }
}

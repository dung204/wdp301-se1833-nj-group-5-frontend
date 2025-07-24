import axios from 'axios';
import 'fuse.js';

import { Province } from '../types';

class ProvincesService {
  async getAllProvinces(name?: string) {
    const {
      data: { provinces },
    } = await axios.get<{ provinces: Province[] }>('/api/address/provinces', {
      params: {
        ...(name && { name }),
      },
    });

    return provinces;
  }
}

export const provincesService = new ProvincesService();

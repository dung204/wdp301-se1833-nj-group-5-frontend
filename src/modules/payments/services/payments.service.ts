import { HttpClient } from '@/base/lib';
import { SuccessResponse } from '@/base/types';

class PaymentsService extends HttpClient {
  constructor() {
    super();
  }

  checkPaymentPaid(orderCode: string) {
    return this.get<SuccessResponse<boolean>>(`/payments/is-paid/${orderCode}`, {
      isPrivateRoute: true,
    });
  }
}

export const paymentsService = new PaymentsService();

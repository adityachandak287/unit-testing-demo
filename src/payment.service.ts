import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentDTO } from './dto/payment.dto';
import { CurrencyRepository } from './repositories/api/currency.repository';

@Injectable()
export class PaymentService {
  constructor(private readonly currencyRepo: CurrencyRepository) {}

  async verifyPayment(paymentDetails: PaymentDTO) {
    const currency = paymentDetails.currency.toLowerCase();

    const isCurrencyValid = await this.currencyRepo.verifyCurrency(currency);

    if (!isCurrencyValid) {
      throw new BadRequestException('Invalid currency');
    }

    let amountPaidInInr = 0;
    if (currency !== 'inr') {
      const exchangeRate = await this.currencyRepo.getINRExchangeRate(currency);
      amountPaidInInr = exchangeRate * paymentDetails.amountPaid;
    } else {
      amountPaidInInr = paymentDetails.amountPaid;
    }

    if (amountPaidInInr < paymentDetails.inrToPay) {
      throw new BadRequestException('Insufficient amount');
    }

    return {
      success: true,
    };
  }
}

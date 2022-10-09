import { Test } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { CurrencyRepository } from './repositories/api/currency.repository';

describe('PaymentService (stub)', () => {
  // Util function to create Testing Module with given value for CurrencyRepository
  const getServiceFromTestingModule = async (
    paymentServicestub: CurrencyRepository,
  ) => {
    const module = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: CurrencyRepository, useValue: paymentServicestub },
      ],
    }).compile();

    return module.get(PaymentService);
  };

  class CurrencyRepositoryStub {
    constructor(
      private isValidCurrency: boolean,
      private exchangeRate: number,
    ) {}

    async verifyCurrency(): Promise<boolean> {
      return this.isValidCurrency;
    }

    async getINRExchangeRate(): Promise<number> {
      return this.exchangeRate;
    }

    static withValues(isValidCurrency: boolean, exchangeRate: number) {
      return new CurrencyRepositoryStub(isValidCurrency, exchangeRate);
    }
  }

  it('verifyPayment should return success if INR value of amount paid is more than amount to pay', async () => {
    // Let currency be valid
    // Let exchange rate be 5
    const service = await getServiceFromTestingModule(
      CurrencyRepositoryStub.withValues(true, 5),
    );

    const response = await service.verifyPayment({
      amountPaid: 1,
      currency: 'VALID',
      inrToPay: 5,
    });

    expect(response).toEqual({ success: true });
  });

  it('verifyPayment should throw Invalid currency Invalid currency BadRequestException if currency is invalid', async () => {
    // Let currency be invalid
    const service = await getServiceFromTestingModule(
      CurrencyRepositoryStub.withValues(false, 0),
    );

    await expect(async () => {
      await service.verifyPayment({
        amountPaid: 999,
        currency: 'INVALID',
        inrToPay: 1234,
      });
    }).rejects.toThrowError('Invalid currency');
  });

  it('verifyPayment should throw Insufficient amount BadRequestException if INR value of amount paid is insufficient', async () => {
    // Let currency be valid
    // Let exchange rate be 100
    const service = await getServiceFromTestingModule(
      CurrencyRepositoryStub.withValues(true, 100),
    );

    await expect(async () => {
      await service.verifyPayment({
        amountPaid: 4,
        currency: 'VALID',
        inrToPay: 500,
      });
    }).rejects.toThrowError('Insufficient amount');
  });

  it('verifyPayment should return success if sufficient amount is paid in INR and it should not fetch the exchange rate', async () => {
    // Let currency be valid
    const service = await getServiceFromTestingModule(
      CurrencyRepositoryStub.withValues(true, 1),
    );

    const response = await service.verifyPayment({
      amountPaid: 1000,
      currency: 'INR',
      inrToPay: 999,
    });

    expect(response).toEqual({ success: true });
  });
});

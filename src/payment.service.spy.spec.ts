import { Test } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { CurrencyRepository } from './repositories/api/currency.repository';

describe('PaymentService (spy)', () => {
  let service: PaymentService;
  let verifyCurrencySpy: jest.SpyInstance<
    ReturnType<CurrencyRepository['verifyCurrency']>,
    Parameters<CurrencyRepository['verifyCurrency']>
  >;
  let getExchangeRateSpy: jest.SpyInstance<
    ReturnType<CurrencyRepository['getINRExchangeRate']>,
    Parameters<CurrencyRepository['getINRExchangeRate']>
  >;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PaymentService, CurrencyRepository],
    }).compile();
    const repository = module.get(CurrencyRepository);
    verifyCurrencySpy = jest.spyOn(repository, 'verifyCurrency');
    getExchangeRateSpy = jest.spyOn(repository, 'getINRExchangeRate');

    service = module.get(PaymentService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('verifyPayment should return success if INR value of amount paid is more than amount to pay', async () => {
    // Let currency be valid
    verifyCurrencySpy.mockResolvedValueOnce(true);
    // Let exchange rate be 5
    getExchangeRateSpy.mockResolvedValueOnce(5);

    const response = await service.verifyPayment({
      amountPaid: 1,
      currency: 'VALID',
      inrToPay: 5,
    });

    expect(response).toEqual({ success: true });
    expect(verifyCurrencySpy).toHaveBeenCalledTimes(1);
    expect(verifyCurrencySpy).toHaveBeenCalledWith('valid');
    expect(getExchangeRateSpy).toHaveBeenCalledTimes(1);
    expect(getExchangeRateSpy).toHaveBeenCalledWith('valid');
  });

  it('verifyPayment should throw Invalid currency Invalid currency BadRequestException if currency is invalid', async () => {
    // Let currency be invalid
    verifyCurrencySpy.mockResolvedValueOnce(false);

    await expect(async () => {
      await service.verifyPayment({
        amountPaid: 999,
        currency: 'INVALID',
        inrToPay: 1234,
      });
    }).rejects.toThrowError('Invalid currency');

    expect(verifyCurrencySpy).toHaveBeenCalledTimes(1);
    expect(getExchangeRateSpy).not.toHaveBeenCalled();
  });

  it('verifyPayment should throw Insufficient amount BadRequestException if INR value of amount paid is insufficient', async () => {
    // Let currency be valid
    verifyCurrencySpy.mockResolvedValueOnce(true);
    // Let exchange rate be 100
    getExchangeRateSpy.mockResolvedValueOnce(80);

    await expect(async () => {
      await service.verifyPayment({
        amountPaid: 4,
        currency: 'VALID',
        inrToPay: 500,
      });
    }).rejects.toThrowError('Insufficient amount');

    expect(verifyCurrencySpy).toHaveBeenCalledWith('valid');
    expect(getExchangeRateSpy).toHaveBeenCalledWith('valid');
  });

  it('verifyPayment should return success if sufficient amount is paid in INR and it should not fetch the exchange rate', async () => {
    // Let currency be valid
    verifyCurrencySpy.mockResolvedValueOnce(true);

    const response = await service.verifyPayment({
      amountPaid: 1000,
      currency: 'INR',
      inrToPay: 999,
    });

    expect(response).toEqual({ success: true });
    expect(verifyCurrencySpy).toHaveBeenCalledTimes(1);
    expect(verifyCurrencySpy).toHaveBeenCalledWith('inr');
    expect(getExchangeRateSpy).not.toHaveBeenCalled();
  });
});

import { Injectable } from '@nestjs/common';
import { request } from 'undici';

@Injectable()
export class CurrencyRepository {
  async verifyCurrency(currency: string): Promise<boolean> {
    try {
      const response = await request(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`,
        {
          method: 'GET',
          bodyTimeout: 5000,
          throwOnError: true,
        },
      );

      const data: Record<string, string> = await response.body.json();

      return Object.keys(data).includes(currency);
    } catch {
      return false;
    }
  }

  async getINRExchangeRate(from: string) {
    const response = await request(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}/inr.json`,
      {
        method: 'GET',
        bodyTimeout: 5000,
        throwOnError: true,
      },
    );

    const data: { date: string; inr: number } = await response.body.json();

    return data.inr;
  }
}

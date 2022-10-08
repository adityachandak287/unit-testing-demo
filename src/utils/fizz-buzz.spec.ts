import { fizzBuzz, generateFizzBuzz } from './fizz-buzz';
describe('FizzBuzz', () => {
  describe('Numbers divisible by 3 should get Fizz', () => {
    it('3 should get Fizz', () => {
      expect(fizzBuzz(3)).toBe('Fizz');
    });

    it('213 should get Fizz', () => {
      expect(fizzBuzz(213)).toBe('Fizz');
    });
  });

  describe('Numbers divisible by 5 should get Fizz', () => {
    it('5 should get Fizz', () => {
      expect(fizzBuzz(5)).toBe('Buzz');
    });

    it('500 should get Fizz', () => {
      expect(fizzBuzz(500)).toBe('Buzz');
    });
  });

  describe('Numbers divisible by 5 and 3 should get FizzBuzz', () => {
    it('15 should get FizzBuzz', () => {
      expect(fizzBuzz(15)).toBe('FizzBuzz');
    });

    it('225 should get FizzBuzz', () => {
      expect(fizzBuzz(225)).toBe('FizzBuzz');
    });
  });

  describe('Numbers not divisible by 5 or 3 should get the number itself', () => {
    it('16 should get 16', () => {
      expect(fizzBuzz(16)).toBe(16);
    });

    it('112 should get 112', () => {
      expect(fizzBuzz(112)).toBe(112);
    });
  });

  describe('generateFizzBuzz should generate FizzBuzz until given number', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockReturnValue();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('generateFizzBuzz should create FizzBuzz sequence of 10', () => {
      generateFizzBuzz(10);

      expect(consoleLogSpy).toHaveBeenCalledTimes(10);
      expect(consoleLogSpy).toHaveBeenLastCalledWith(10, 'Buzz');
    });

    it('generateFizzBuzz should create FizzBuzz sequence of 0', () => {
      generateFizzBuzz(0);

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});

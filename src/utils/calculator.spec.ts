import { Calculator } from './calculator';

describe('Calculator', () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator();
  });

  it('adding 1 and 2 should give 3', () => {
    expect(calc.add(1, 2)).toBe(3);
  });

  it('adding 2 and 1 should give 3', () => {
    expect(calc.add(2, 1)).toBe(3);
  });

  it('subtracting 4 from 10 should give 6', () => {
    expect(calc.subtract(10, 4)).toBe(6);
  });

  it('multiplying 3 and 6 should give 18', () => {
    expect(calc.multiply(3, 6)).toBe(18);
  });

  it('multiplying 6 and 3 should give 18', () => {
    expect(calc.multiply(6, 3)).toBe(18);
  });

  it('dividing 6 by 2 should give 3', () => {
    expect(calc.divide(6, 3)).toBe(2);
  });

  it('dividing 6 by 0 should throw error', () => {
    expect(() => {
      calc.divide(6, 0);
    }).toThrowError('Cannot divide by 0!');
  });
});

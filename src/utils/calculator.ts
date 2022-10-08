export class Calculator {
  public add(a: number, b: number) {
    return a + b;
  }

  public subtract(a: number, b: number) {
    return a - b;
  }

  public multiply(a: number, b: number) {
    return a * b;
  }

  public divide(a: number, b: number) {
    if (b === 0) {
      throw new Error('Cannot divide by 0!');
    }
    return a / b;
  }
}

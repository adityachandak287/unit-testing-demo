export const fizzBuzz = (n: number): 'Fizz' | 'Buzz' | 'FizzBuzz' | number => {
  if (n % 15 === 0) {
    return 'FizzBuzz';
  } else if (n % 3 === 0) {
    return 'Fizz';
  } else if (n % 5 === 0) {
    return 'Buzz';
  } else {
    return n;
  }
};

export const generateFizzBuzz = (n: number) => {
  for (let i = 1; i <= n; i++) {
    console.log(i, fizzBuzz(i));
  }
};

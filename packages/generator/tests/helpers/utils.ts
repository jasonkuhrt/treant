export const catchOrThrow = <error extends Error>(f: () => any): error => {
  try {
    f();
  }
  catch (error) {
    return error as any;
  }

  throw new Error('Function did not throw');
};

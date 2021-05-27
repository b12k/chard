export const asyncForEach = async <T = unknown>(
  array: Array<T>,
  callback: (item: T, index: number, array: Array<T>) => void | Promise<void>,
) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line
  }
};

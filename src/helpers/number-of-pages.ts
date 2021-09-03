import {pozitiveNumberValidator} from "./pozitive-number-validator";

export const numberOfPages = (totalNumberOfItems: number, pageSize: number) => {
  if (
    !pozitiveNumberValidator(totalNumberOfItems) ||
    !pozitiveNumberValidator(pageSize)
  ) {
    throw new Error('Total number of items and the page size must be pozitiv numbers. ');
  }

  const numberOfTotalPages = Math.ceil(totalNumberOfItems / pageSize);

  return numberOfTotalPages;
};
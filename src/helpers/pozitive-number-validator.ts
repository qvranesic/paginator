import {isNill} from "./is-nill";

/**
 * Helper function to determine if a value is a positive number
 *
 * @param value Check if this property is a positive number.
 * @param includeZero Should zero be valid?
 * @returns True or false
 */
export const pozitiveNumberValidator = (value?: number, includeZero = false) => {
  if (isNill(value)) return false;

  return value as number > (includeZero ? -1 : 0);
};
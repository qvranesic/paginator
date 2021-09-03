import {isNill} from "../../helpers/is-nill";
import {pozitiveNumberValidator} from "../../helpers/pozitive-number-validator";

export interface PaginatorButtonProps {
  /**
   * Is this button corresponding with the paginator local state?
   */
  active?: boolean;
  /**
   * Button contents
   */
  label: string;
  /**
   * Is this button disabled?
   */
  disabled?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

export interface PaginatorDropdownProps {
  /**
   * Dropdown value to be assigned to Dropdown Component
   */
  option?: number;
  /**
   * Should be called on Dropdown Component select
   */
  onSelect?: (nextOption: number) => any;
}

type PaginatorErrorType = "getAdjecentPageNumbers";

type PaginatorErrorCode =
  | "lastPageNumber_must_be_greater_then_zero"
  | "currentPageNumber_must_be_greater_then_zero"
  | "currentPageNumber_must_not_be_greater_then_lastPageNumber";

interface PaginatorErrorOptions {
  type: PaginatorErrorType;
  code: PaginatorErrorCode;
}

export class PaginatorError extends Error {
  static component = "Paginator";

  constructor(
    public readonly type: PaginatorErrorType,
    public readonly code: PaginatorErrorCode
  ) {
    super(
      `For ${
        PaginatorError.component
      }.${type} to work, ${PaginatorError.getCodeMessage(code)}`
    );
  }

  static getCodeMessage(code: PaginatorErrorCode) {
    switch (code) {
      case "lastPageNumber_must_be_greater_then_zero":
        return "lastPageNumber prop must be a pozitive number!";
      case "currentPageNumber_must_be_greater_then_zero":
        return "currentPageNumber prop must be a pozitive number!";
      case "currentPageNumber_must_not_be_greater_then_lastPageNumber":
        return "currentPageNumber prop must not be greater then lastPageNumber prop!";
    }
  }
}

export const getAdjecentPageNumbers = (
  numberOfAdjacentPageNumbers: number,
  currentPageNumber: number,
  lastPageNumber: number
) => {
  if (!pozitiveNumberValidator(lastPageNumber)) {
    throw new PaginatorError(
      "getAdjecentPageNumbers",
      "lastPageNumber_must_be_greater_then_zero"
    );
  }

  if (!pozitiveNumberValidator(currentPageNumber)) {
    throw new PaginatorError(
      "getAdjecentPageNumbers",
      "currentPageNumber_must_be_greater_then_zero"
    );
  }

  if (currentPageNumber > lastPageNumber) {
    throw new PaginatorError(
      "getAdjecentPageNumbers",
      "currentPageNumber_must_not_be_greater_then_lastPageNumber"
    );
  }

  numberOfAdjacentPageNumbers = !pozitiveNumberValidator(
    numberOfAdjacentPageNumbers
  )
    ? 0
    : numberOfAdjacentPageNumbers;

  const numberOfAvailableLowerPageNumbers = currentPageNumber - 1;
  const numberOfAvailableGreaterPageNumbers =
    lastPageNumber - currentPageNumber;

  let numberOfLowerPageNumbers = Math.min(
    numberOfAdjacentPageNumbers,
    numberOfAvailableLowerPageNumbers
  );
  const numberOfLeftoverLowerPageNumbers = !pozitiveNumberValidator(
    numberOfAdjacentPageNumbers
  )
    ? 0
    : numberOfAdjacentPageNumbers - numberOfLowerPageNumbers;

  let numberOfGreaterPageNumbers = Math.min(
    numberOfAdjacentPageNumbers,
    numberOfAvailableGreaterPageNumbers
  );
  const numberOfLeftoverGreaterPageNumbers = !pozitiveNumberValidator(
    numberOfAdjacentPageNumbers
  )
    ? 0
    : numberOfAdjacentPageNumbers - numberOfGreaterPageNumbers;

  if (
    numberOfLeftoverLowerPageNumbers > 0 !==
    numberOfLeftoverGreaterPageNumbers > 0
  ) {
    if (numberOfLeftoverLowerPageNumbers) {
      numberOfGreaterPageNumbers = Math.min(
        numberOfGreaterPageNumbers + numberOfLeftoverLowerPageNumbers,
        numberOfAvailableGreaterPageNumbers
      );
    }

    if (numberOfLeftoverGreaterPageNumbers) {
      numberOfLowerPageNumbers = Math.min(
        numberOfLowerPageNumbers + numberOfLeftoverGreaterPageNumbers,
        numberOfAvailableLowerPageNumbers
      );
    }
  }

  let lowerPageNumbers = !numberOfLowerPageNumbers
    ? []
    : new Array(numberOfLowerPageNumbers)
        .fill(0)
        .map(
          (_value, index) =>
            currentPageNumber - numberOfLowerPageNumbers + index
        );

  let greaterPageNumbers = !numberOfGreaterPageNumbers
    ? []
    : new Array(numberOfGreaterPageNumbers)
        .fill(0)
        .map((_value, index) => currentPageNumber + index + 1);

  return [lowerPageNumbers, greaterPageNumbers];
};

export type PaginatorButtonIdentifiers =
  | "first"
  | "prev"
  | "current"
  | "next"
  | "last";

export interface PaginatorButtonInternalProps {
  label: string;
  active: boolean;
  disabled: boolean;
  nextPageNumber: number;
}

export const getPaginatorButtonInternalProps = (
  buttonIdentifier: PaginatorButtonIdentifiers | number,
  currentPageNumber: number,
  lastPageNumber: number
): Omit<PaginatorButtonInternalProps, "label"> => {
  let active = false;
  let disabled: boolean;
  let nextPageNumber: number;

  switch (buttonIdentifier) {
    case "first":
      nextPageNumber = 1;
      break;
    case "prev":
      nextPageNumber = currentPageNumber - 1;
      break;
    case "current":
      active = true;
      disabled = false;
      nextPageNumber = currentPageNumber;
      break;
    case "next":
      nextPageNumber = currentPageNumber + 1;
      break;
    case "last":
      nextPageNumber = lastPageNumber;
      break;
    default:
      nextPageNumber = buttonIdentifier;
      break;
  }

  if (isNill(disabled)) {
    disabled =
      nextPageNumber < 1 || nextPageNumber > lastPageNumber
        ? true
        : currentPageNumber === nextPageNumber;
  }

  return {
    active,
    disabled,
    nextPageNumber,
  };
};
import React, {Fragment, useCallback, useEffect, useState} from "react";
import {numberOfPages} from "../../helpers/number-of-pages";
import {pozitiveNumberValidator} from "../../helpers/pozitive-number-validator";
import {
  getAdjecentPageNumbers,
  getPaginatorButtonInternalProps,
  PaginatorButtonIdentifiers,
  PaginatorButtonInternalProps,
  PaginatorButtonProps,
  PaginatorDropdownProps,
} from "./helpers";

export interface PaginatorProps {
  /**
   * Defines the initial page size value of the local state (currentPageSize) no changes are registered by the component and it does not override the pageSize prop.
   */
  initialPageSize?: number;
  /**
   * Takes control over the page size value of the local state (currentPageSize).
   * This property is being tracked and updates the component on change.
   * While not defined, the component manages the local state on it's own.
   */
  pageSize?: number;
  /**
   * Should page size options be rendered on the left of the page number buttons?
   * This property is being tracked and updates the component on change.
   */
  optionsOnTheLeft?: boolean;
  /**
   * A list of page size options to choose from.
   * This property is being tracked and updates the component on change.
   */
  pageSizeOptions: number[];
  /**
   * The number of total items expected to be able to paginate through.
   * This property is being tracked and updates the component on change.
   */
  totalNumberOfItems: number;
  /**
   * Defines the initial page number value of the local state (currentPageNumber) no changes are registered by the component and it does not override the pageNumber prop.
   */
  initialPageNumber?: number;
  /**
   * Takes control over the page number value of the local state (currentPageNumber).
   * This property is being tracked and updates the component on change.
   * While not defined, the component manages the local state on it's own.
   */
  pageNumber?: number;
  /**
   * Should page numbers be ordered in a decending order?
   * This property is being tracked and updates the component on change.
   */
  descending?: boolean;
  /**
   * A list of identifiers (predefined keys) to determine the order of buttons.
   * This property is being tracked and updates the component on change.
   */
  buttonIdentifiers: PaginatorButtonIdentifiers[];
  /**
   * An object with button identifiers as keys where the values are the coresponding button labels.
   * This property is being tracked and updates the component on change.
   */
  buttonIdentifierLabels?: {
    [key in PaginatorButtonIdentifiers]?: string;
  };
  /**
   * The number of page numbers to show next to the current page number (on one side).
   * This property is being tracked and updates the component on change.
   */
  numberOfAdjacentPageNumbers?: number;
  selectPageNumber?: (pageNumber: number) => any;
  selectPageSize?: (pageSize: number) => any;
  renderSelectPageNumberButton: (props: PaginatorButtonProps) => JSX.Element;
  renderSelectPageSizeDropdown?: (props: PaginatorDropdownProps) => JSX.Element;
}

export const Paginator = ({
  initialPageSize,
  optionsOnTheLeft,
  pageSizeOptions,
  pageSize = pageSizeOptions[0],
  totalNumberOfItems,
  initialPageNumber,
  pageNumber,
  descending,
  buttonIdentifiers,
  buttonIdentifierLabels,
  numberOfAdjacentPageNumbers = 0,
  selectPageSize,
  selectPageNumber,
  renderSelectPageNumberButton,
  renderSelectPageSizeDropdown,
}: PaginatorProps) => {
  useEffect(() => {
    if (!pageSizeOptions?.length) {
      throw new Error("Page size options must have at least one option!");
    }
  }, [pageSizeOptions]);

  const [currentPageSize, setCurrentPageSize] = useState<number>(
    pageSize ?? initialPageSize ?? pageSizeOptions[0]
  );

  useEffect(() => {
    if (!pageSizeOptions.includes(currentPageSize)) {
      setPageSize(pageSizeOptions[0]);
    }
  }, [pageSizeOptions, currentPageSize]);
  
  useEffect(() => {
    if (pageSizeOptions.includes(pageSize)) {
      setCurrentPageSize(pageSize);
    }
  }, [pageSize]);

  const setPageSize = useCallback(
    (nextPageSize: number) => {
      if (!pageSizeOptions.includes(pageSize)) {
        setCurrentPageSize(nextPageSize);
      }
      if (selectPageSize) {
        selectPageSize(nextPageSize);
      }
    },
    [pageSizeOptions, selectPageSize, pageSize]
  );

  const [lastPageNumber, setLastPageNumber] = useState<number>(
    numberOfPages(totalNumberOfItems, currentPageSize)
  );

  useEffect(() => {
    const nextLastPageNumber = numberOfPages(
      totalNumberOfItems,
      currentPageSize
    );

    if (currentPageNumber > nextLastPageNumber) {
      setPageNumber(nextLastPageNumber, true);
    }

    setLastPageNumber(nextLastPageNumber);
  }, [currentPageSize, totalNumberOfItems]);

  const [currentPageNumber, setCurrentPageNumber] = useState<number>(
    (pozitiveNumberValidator(pageNumber) ? pageNumber : null) ??
      (pozitiveNumberValidator(initialPageNumber) ? initialPageNumber : null) ??
      1
  );

  useEffect(() => {
    if (pozitiveNumberValidator(pageNumber)) {
      setCurrentPageNumber(pageNumber as number);
    }
  }, [pageNumber]);

  const setPageNumber = useCallback(
    (nextPageNumber: number, force: boolean = false) => {
      if (force || !pozitiveNumberValidator(pageNumber)) {
        setCurrentPageNumber(nextPageNumber);
      }

      if (selectPageNumber) {
        selectPageNumber(nextPageNumber);
      }
    },
    [selectPageNumber, pageNumber]
  );

  const paginatorButtonInternalProps = useCallback(() => {
    const [lowerPageNumbers, greaterPageNumbers] = getAdjecentPageNumbers(
      numberOfAdjacentPageNumbers,
      currentPageNumber,
      lastPageNumber
    );

    const leftPageNumbers = descending
      ? greaterPageNumbers.reverse()
      : lowerPageNumbers;
    const rightPageNumbers = descending
      ? lowerPageNumbers.reverse()
      : greaterPageNumbers;

    return buttonIdentifiers.reduce(
      (array, identifier) => [
        ...array,
        ...(identifier === "current"
          ? [
              ...leftPageNumbers.map((pageNumber) => ({
                label: pageNumber.toString(),
                ...getPaginatorButtonInternalProps(
                  pageNumber,
                  currentPageNumber,
                  lastPageNumber
                ),
              })),
              {
                label:
                  buttonIdentifierLabels?.[identifier] ??
                  currentPageNumber.toString(),
                ...getPaginatorButtonInternalProps(
                  identifier,
                  currentPageNumber,
                  lastPageNumber
                ),
              },
              ...rightPageNumbers.map((pageNumber) => ({
                label: pageNumber.toString(),
                ...getPaginatorButtonInternalProps(
                  pageNumber,
                  currentPageNumber,
                  lastPageNumber
                ),
              })),
            ]
          : [
              {
                label: buttonIdentifierLabels?.[identifier] ?? identifier,
                ...getPaginatorButtonInternalProps(
                  identifier,
                  currentPageNumber,
                  lastPageNumber
                ),
              },
            ]),
      ],
      [] as PaginatorButtonInternalProps[]
    );
  }, [
    currentPageNumber,
    lastPageNumber,
    descending,
    buttonIdentifiers,
    buttonIdentifierLabels,
    numberOfAdjacentPageNumbers,
  ]);

  const renderPageSizeOptions = useCallback(
    () =>
      pageSizeOptions.length > 1 && renderSelectPageSizeDropdown &&
      renderSelectPageSizeDropdown({
        option: currentPageSize,
        onSelect: (nextPageSize) => setPageSize(nextPageSize),
      }),
    [pageSizeOptions, currentPageSize]
  );

  return (
    <>
      {optionsOnTheLeft && renderPageSizeOptions()}
      {paginatorButtonInternalProps().map(
        ({nextPageNumber, ...props}, index) => (
          <Fragment key={index}>
            {renderSelectPageNumberButton({
              ...props,
              active:
                nextPageNumber === currentPageNumber &&
                !isNaN(parseInt(props.label)),
              onClick: () => setPageNumber(nextPageNumber),
            })}
          </Fragment>
        )
      )}
      {!optionsOnTheLeft && renderPageSizeOptions()}
    </>
  );
};
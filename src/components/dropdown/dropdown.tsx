import React, {useCallback, useEffect, useState} from "react";
import {IHasDisplayValue} from "../../interfaces/has-display-value.interface";

export interface IDropdownOption<T> extends IHasDisplayValue {
  value: T;
}

export interface DropdownProps<T> {
  /**
   * Defines initial local state (currentOption) but does not override option prop nor are changes registered by the component.
   */
  initialOption?: T;
  /**
   * Updates the local state (currentOption) in real time.
   * While not defined, the component manages the local state on it's own
   */
  option?: T;
  /**
   * A list of options to choose from
   * Each option need to have a value and a displayValue property
   */
  availableOptions: IDropdownOption<T>[];
  /**
   * Fires when an option is clicked.
   * Props are self explanatory.
   */
  onSelect?: (nextOption: T, previousOption: T) => any;
  [key: string]: any;
}

export const Dropdown = <T,>({
  availableOptions,
  option = availableOptions[0].value,
  initialOption,
  onSelect,
  ...props
}: DropdownProps<T>) => {
  /**
   * Local state of component and single source of truth
   */
  const [currentOption, setCurrentOption] = useState<T>(
    initialOption ?? option
  );

  /**
   * If option prop is defined, it should update the local state (currentOption) in real time
   */
  useEffect(() => {
    if (availableOptions.map(({value}) => value).includes(option)) {
      setCurrentOption(option);
    }
  }, [availableOptions, option]);

  /**
   * Single point of control over select element value!
   */
  const setValue = useCallback(
    (nextOption: T) => {
      /**
       * Update the local state (currentStatus) only if there is no option prop defined!
       * If the option prop is defined, it should be the only way to update the local status (currentOption)
       */
      if (!availableOptions.map(({value}) => value).includes(option)) {
        setCurrentOption(nextOption);
      }

      if (onSelect) {
        onSelect(nextOption, currentOption);
      }
    },
    [availableOptions, currentOption, onSelect]
  );

  return (
    <select
      onChange={(e) => {
        /**
         * We want total control over the select element!
         * The select element is updated via the local state (currentValue)
         */
        e.preventDefault();

        setValue(JSON.parse(e.target.value));
      }}
      value={`${currentOption}`}
      {...props}
    >
      {availableOptions.map((availableOption, index) => (
        <option key={index} value={JSON.stringify(availableOption.value)}>
          {availableOption.displayValue}
        </option>
      ))}
    </select>
  );
};
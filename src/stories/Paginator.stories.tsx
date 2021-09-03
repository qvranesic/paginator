import {Meta, Story} from "@storybook/react";
import React, {useState} from "react";
import {Button} from "./Button";
import {Dropdown} from "../components/dropdown";
import {Paginator, PaginatorProps} from "../components/paginator";
import {PaginatorButtonProps, PaginatorDropdownProps} from "../components/paginator/helpers";
import { pageSizeOptions } from "../constants/page-size-options";

export default {
  title: "Example/Paginator",
  component: Paginator,
} as Meta;

const Template: Story<PaginatorProps> = (args) => <Paginator {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  initialPageNumber: 2,
  pageSizeOptions,
  totalNumberOfItems: 100,
  numberOfAdjacentPageNumbers: 1,
  buttonIdentifiers: ["first", "prev", "current", "next", "last"],
  renderSelectPageNumberButton: ({
    active,
    label,
    ...props
  }: PaginatorButtonProps) => (
    <Button primary={active} label={label.toUpperCase()} {...props} />
  ),
  renderSelectPageSizeDropdown: (props: PaginatorDropdownProps) => (
    <Dropdown
      availableOptions={pageSizeOptions.map((value) => ({
        displayValue: value.toString(),
        value,
      }))}
      {...props}
    />
  ),
};

export const WithLabels = Template.bind({});
WithLabels.args = {
  initialPageNumber: 2,
  pageSizeOptions,
  totalNumberOfItems: 100,
  numberOfAdjacentPageNumbers: 1,
  buttonIdentifiers: ["first", "prev", "current", "next", "last"],
  buttonIdentifierLabels: {
    current: "CURRENT",
  },
  renderSelectPageNumberButton: ({
    active,
    label,
    ...props
  }: PaginatorButtonProps) => (
    <Button primary={active} label={label.toUpperCase()} {...props} />
  ),
  renderSelectPageSizeDropdown: (props: PaginatorDropdownProps) => (
    <Dropdown
      availableOptions={pageSizeOptions.map((value) => ({
        displayValue: value.toString(),
        value,
      }))}
      {...props}
    />
  ),
};

export const Descending = Template.bind({});
Descending.args = {
  initialPageNumber: 2,
  pageSizeOptions,
  totalNumberOfItems: 100,
  descending: true,
  optionsOnTheLeft: true,
  numberOfAdjacentPageNumbers: 1,
  buttonIdentifiers: ["last", "next", "current", "prev", "first"],
  renderSelectPageNumberButton: ({
    active,
    label,
    ...props
  }: PaginatorButtonProps) => (
    <Button primary={active} label={label.toUpperCase()} {...props} />
  ),
  renderSelectPageSizeDropdown: (props: PaginatorDropdownProps) => (
    <Dropdown
      availableOptions={pageSizeOptions.map((value) => ({
        displayValue: value.toString(),
        value,
      }))}
      {...props}
    />
  ),
};

export const Error = Template.bind({});
Error.args = {
  initialPageNumber: 11,
  pageSizeOptions,
  totalNumberOfItems: 100,
  numberOfAdjacentPageNumbers: 1,
  buttonIdentifiers: ["first", "prev", "current", "next", "last"],
  renderSelectPageNumberButton: ({
    active,
    label,
    ...props
  }: PaginatorButtonProps) => (
    <Button primary={active} label={label.toUpperCase()} {...props} />
  ),
  renderSelectPageSizeDropdown: (props: PaginatorDropdownProps) => (
    <Dropdown
      availableOptions={pageSizeOptions.map((value) => ({
        displayValue: value.toString(),
        value,
      }))}
      {...props}
    />
  ),
};

const TemplateWithButtons: Story<PaginatorProps> = ({
  initialPageNumber,
  initialPageSize,
  pageSizeOptions,
  totalNumberOfItems,
  numberOfAdjacentPageNumbers,
  buttonIdentifiers,
}) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(initialPageNumber);
  const [currentPageSize, setCurrentPageSize] = useState(initialPageSize);

  return (
    <>
      <p>CurrentPageNumber: {currentPageNumber}</p>
      <p>CurrentPageSize: {currentPageSize}</p>
      <Paginator
        pageSize={currentPageSize}
        pageNumber={currentPageNumber}
        numberOfAdjacentPageNumbers={numberOfAdjacentPageNumbers}
        totalNumberOfItems={totalNumberOfItems}
        pageSizeOptions={pageSizeOptions}
        buttonIdentifiers={buttonIdentifiers}
        selectPageNumber={(pageNumber) => {
          switch (pageNumber) {
            case currentPageNumber:
              break;
            default: {
              setCurrentPageNumber(pageNumber);
            }
          }
        }}
        selectPageSize={(pageSize) => setCurrentPageSize(pageSize)}
        renderSelectPageNumberButton={({active, label, ...props}) => (
          <Button primary={active} label={label.toUpperCase()} {...props} />
        )}
        renderSelectPageSizeDropdown={(props) => (
          <Dropdown
            availableOptions={pageSizeOptions.map((value) => ({
              displayValue: value.toString(),
              value,
            }))}
            {...props}
          />
        )}
      />
    </>
  );
};

export const WithButtons = TemplateWithButtons.bind({});
WithButtons.args = {
  initialPageNumber: 2,
  initialPageSize: pageSizeOptions[1],
  numberOfAdjacentPageNumbers: 1,
  pageSizeOptions,
  totalNumberOfItems: 100,
  buttonIdentifiers: ["first", "prev", "current", "next", "last"],
};
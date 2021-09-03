import {Meta, Story} from "@storybook/react";
import React, {Fragment, useState} from "react";
import {Button} from "./Button";
import {Dropdown, DropdownProps} from "../components/dropdown";

export default {
  title: "Example/Dropdown",
  component: Dropdown,
  argTypes: {
    disabled: {control: "boolean"},
  },
} as Meta;

const NumberTemplate: Story<DropdownProps<number>> = (props) => (
  <Dropdown {...props} />
);

const options = [10, 25, 50];
const availableOptions = options.map((value) => ({
  displayValue: value.toString(),
  value,
}));

const NumberTemplateWithLog: Story<DropdownProps<number>> = ({
  availableOptions,
  onSelect,
  option,
  ...props
}) => {
  const [events, setEvents] = useState<{next: number, prev: number}[]>([]);

  return (
    <>
      <Dropdown
        availableOptions={options.map((value) => ({
          displayValue: value.toString(),
          value,
        }))}
        onSelect={(next, prev) => setEvents([...events, {next, prev}])}
        {...props}
      />
      <div>
        {!events.length
          ? "No events have been triggered yet. "
          : events.map(({next, prev}, index) => (
              <Fragment key={index}>
                <span>
                  {prev} {"=>"} {next}
                </span>
                <br />
              </Fragment>
            ))}
      </div>
    </>
  );
};

const TemplateWithFeedback: Story<DropdownProps<boolean | null>> = ({
  status,
  onSelect,
  availableOptions,
  ...props
}) => {
  const [value, setValue] = useState<boolean | null>();

  return (
      <Dropdown
        option={value}
        availableOptions={availableOptions}
        onSelect={(next, prev) => {
          onSelect && onSelect(next, prev);
          setValue(next);
        }}
        {...props}
      />
  );
};

const TemplateWithButtons: Story<DropdownProps<number>> = ({
  status,
  onSelect,
  availableOptions,
  ...props
}) => {
  const [value, setValue] = useState<number>();

  return (
    <>
      {options.map((optoin, index) => {
        return (
          <Button
            key={index}
            label={optoin.toString()}
            primary={optoin === value}
            onClick={() => setValue(optoin)}
          ></Button>
        );
      })}
      <Dropdown
        option={value}
        availableOptions={availableOptions}
        onSelect={(next, prev) => {
          onSelect && onSelect(next, prev);
          setValue(next);
        }}
        {...props}
      />
    </>
  );
};

export const Number = NumberTemplate.bind({});
Number.args = {
  availableOptions,
  onSelect: (next, prev) => console.log(`${prev} => ${next}`),
};

export const WithLog = NumberTemplateWithLog.bind({});
WithLog.args = {
  availableOptions,
  onSelect: (next, prev) => console.log(`${prev} => ${next}`),
  initialOption: options[2],
};

export const WithFeedback = TemplateWithFeedback.bind({});
WithFeedback.args = {
  availableOptions: [{
    displayValue: 'True',
    value: true,
  },
  {
    displayValue: 'False',
    value: false,
  },
  {
    displayValue: 'Neither',
    value: null,
  },
  ],
  onSelect: (next, prev) => console.log(`${prev} => ${next}`),
  initialOption: options[0],
};

export const WithButtons = TemplateWithButtons.bind({});
WithButtons.args = {
  availableOptions: [{
    displayValue: 'TEN',
    value: 10,
  },
  {
    displayValue: 'TwentyFive',
    value: 25,
  },
  {
    displayValue: 'Fifty',
    value: 50,
  },
  ],
  onSelect: (next, prev) => console.log(`${prev} => ${next}`),
  initialOption: options[1],
};
"use client"
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC } from "react";
import { Button } from "./ui/button";

export type SelectItem = {
  value: string;
  name: string;
};

interface SelectProps {
  placeholder: string;
  label: string;
  itemsToSelect: SelectItem[];
  // onValueChange: Dispatch<SetStateAction<string>>
  onValueChange: (value: string) => void;
  onValueChangeTaskFxn?: () => void;
  selectedValue?: string;
  shouldDisplayExecuteValueChangeButton?: boolean;
  executeValueChangeButtonText?: string;
  executeValueChangeButtonStyle?: string;
}

const SelectComponent: FC<SelectProps> = ({
  placeholder,
  label,
  itemsToSelect,
  onValueChange,
  onValueChangeTaskFxn,
  // selectedValue,
  shouldDisplayExecuteValueChangeButton,
  executeValueChangeButtonText,
  executeValueChangeButtonStyle,
}) => {

React.useEffect(() => {
    if (onValueChangeTaskFxn) {
      // execute the onValueChangeTaskFxn function
      onValueChangeTaskFxn();
    }
  }, []);

  return (
    <div>
      <Select onValueChange={onValueChange}>
        <SelectTrigger className="">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>

            {itemsToSelect.map((item, index) => {
              return (
                <SelectItem key={item.name + index} value={item.value}>
                  {item.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {shouldDisplayExecuteValueChangeButton &&
        executeValueChangeButtonText && (
          <Button
            variant={"default"}
            className={executeValueChangeButtonStyle}
            onClick={() => {
              if (onValueChangeTaskFxn) {
                onValueChangeTaskFxn();
              }
            }}
          >
            {executeValueChangeButtonText}
          </Button>
        )}
    </div>
  );
};

export default SelectComponent;

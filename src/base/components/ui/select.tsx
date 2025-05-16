'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useId, useState } from 'react';

import { Button } from '@/base/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/base/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/base/components/ui/popover';
import { cn } from '@/base/lib';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
};

type SelectProps = {
  /** List of options to display */
  options: SelectOption[];
  /** Function to render each option */
  renderOption?: (option: SelectOption) => React.ReactNode;
  /** Function to get the display value for the selected option */
  getDisplayValue?: (option: SelectOption) => React.ReactNode;
  /** Custom not found message */
  notFound?: React.ReactNode;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Custom class names */
  className?: string;
  /** Custom trigger button class names */
  triggerClassName?: string;
  /** Custom no results message */
  noResultsMessage?: string;
  /** Allow clearing the selection */
  clearable?: boolean;
  /** Allow searching through options */
  searchable?: boolean;
} & (
  | {
      /** Allow the select to select multiple values */
      multiple?: false;
      /** Currently selected value */
      value?: string;
      /** Callback when selection changes */
      onChange?: (value: string) => void;
    }
  | {
      /** Allow the select to select multiple values */
      multiple: true;
      /** Currently selected values */
      value?: string[];
      /** Callback when selection changes */
      onChange?: (value: string[]) => void;
    }
);

export function Select({
  options,
  renderOption,
  getDisplayValue = (option) => option.label,
  notFound,
  placeholder = 'Select...',
  disabled = false,
  className,
  triggerClassName,
  noResultsMessage,
  clearable = true,
  searchable = true,
  value,
  onChange,
  multiple,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(() => {
    if (value && !multiple) {
      return value as string;
    }
    return null;
  });
  const [selectedValues, setSelectedValues] = useState(() => {
    if (value && multiple) {
      return value as string[];
    }
    return [];
  });
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(() => {
    if (value && !multiple) {
      const selected = options.find((option) => option.value === value);
      return selected || null;
    }

    return null;
  });
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>(() => {
    if (value && multiple) {
      const selected = options.filter((option) => (value as string[]).includes(option.value));
      return selected;
    }

    return [];
  });
  const [searchTerm, setSearchTerm] = useState('');

  const id = useId();

  const handleSelect = (currentValue: string) => {
    if (!multiple) {
      const newValue = clearable && currentValue === selectedValue ? '' : currentValue;
      setSelectedValue(newValue);
      setSelectedOption(options.find((option) => option.value === newValue) || null);
      onChange?.(newValue);
      setOpen(false);
      return;
    }

    const newValues =
      clearable && selectedValues.includes(currentValue)
        ? selectedValues.filter((val) => val !== currentValue)
        : [...selectedValues, currentValue];
    setSelectedValues(newValues);

    setSelectedOptions(
      clearable && selectedOptions.some((opt) => opt.value === currentValue)
        ? selectedOptions.filter((opt) => opt.value !== currentValue)
        : [...selectedOptions, options.find((opt) => opt.value === currentValue)!],
    );

    onChange?.(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between truncate',
            disabled && 'cursor-not-allowed opacity-50',
            {
              'text-muted-foreground':
                (multiple && selectedValues.length === 0) || (!multiple && !selectedValue),
            },
            triggerClassName,
          )}
          disabled={disabled}
        >
          {(() => {
            if (multiple) return <></>;

            if (selectedOption) return getDisplayValue(selectedOption);

            return placeholder;
          })()}
          {(() => {
            if (!multiple) return <></>;
            if (selectedOptions.length === 0) return placeholder;

            if (selectedOptions.length === 1)
              return <span>{getDisplayValue(selectedOptions[0])}</span>;

            if (selectedOptions.length === 2)
              return (
                <span>
                  {getDisplayValue(selectedOptions[0])}, {getDisplayValue(selectedOptions[1])}
                </span>
              );

            if (selectedOptions.length > 2)
              return (
                <span>
                  {getDisplayValue(selectedOptions[0])}, {getDisplayValue(selectedOptions[1])}, and{' '}
                  {selectedOptions.length - 2} more...
                </span>
              );
          })()}
          <ChevronsUpDown className="opacity-50" size={10} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[--radix-popover-trigger-width] p-0', className)}>
        <Command shouldFilter={false}>
          {searchable && (
            <div className="relative w-full border-b">
              <CommandInput
                placeholder={`Search...`}
                value={searchTerm}
                onValueChange={(value) => {
                  setSearchTerm(value);
                }}
              />
            </div>
          )}
          <CommandList>
            {options.length === 0 &&
              (notFound || <CommandEmpty>{noResultsMessage ?? `No items found.`}</CommandEmpty>)}
            <CommandGroup>
              {options
                .filter(
                  (option) =>
                    searchTerm === '' ||
                    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((option) => (
                  <CommandItem
                    key={`${id}-option-${option.value}`}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    {!renderOption ? option.label : renderOption(option)}
                    <Check
                      className={cn('ml-auto h-3 w-3 opacity-0', {
                        'opacity-100':
                          (!multiple && selectedValue === option.value) ||
                          (multiple && selectedValues.includes(option.value)),
                      })}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

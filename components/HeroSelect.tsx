'use client';

import { ListBox, Select } from '@heroui/react';
import type { CSSProperties } from 'react';

export interface HeroSelectOption {
  value: string;
  label: string;
}

interface HeroSelectProps {
  value: string;
  options: HeroSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const emptyOptionKey = '__hero_select_empty_option__';

export default function HeroSelect({
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
  isRequired,
  isDisabled,
  className,
  style,
}: HeroSelectProps) {
  const hasEmptyOption = options.some((option) => option.value === '');
  const selectedKey = value === '' && hasEmptyOption ? emptyOptionKey : value || undefined;

  return (
    <Select
      aria-label={ariaLabel}
      selectedKey={selectedKey}
      onSelectionChange={(key) => onChange(key === emptyOptionKey ? '' : String(key ?? ''))}
      isRequired={isRequired}
      isDisabled={isDisabled}
      placeholder={placeholder}
      className={className}
      style={style}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => {
            const key = option.value === '' ? emptyOptionKey : option.value;
            return <ListBox.Item key={key} id={key}>{option.label}</ListBox.Item>;
          })}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
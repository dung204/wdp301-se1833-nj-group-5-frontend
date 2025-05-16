import * as DocBlock from '@storybook/blocks';
import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import {
  DateRange,
  DayPickerMultipleProps,
  DayPickerRangeProps,
  DayPickerSingleProps,
} from 'react-day-picker';

import { Calendar } from '@/base/components/ui/calendar';

type StoryProps = ComponentProps<typeof Calendar>;

const meta: Meta<StoryProps> = {
  component: Calendar,
  title: 'Components/Data Display/Calendar',
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['mode'],
    },
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description />
          <p>
            Built on top of{' '}
            <a href="https://daypicker.dev/" target="_blank">
              React DayPicker
            </a>
          </p>
          <DocBlock.Stories />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    showOutsideDays: true,
  },
  argTypes: {
    showOutsideDays: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Single: Story = {
  args: {
    mode: 'single',
    selected: new Date(),
  },
  argTypes: {
    selected: {
      control: { type: 'date' },
    },
  },
  render: function Comp(args: DayPickerSingleProps) {
    const [, setArgs] = useArgs<DayPickerSingleProps>();

    const handleSelect = (date?: Date) => {
      setArgs({ selected: date });
    };

    return <Calendar {...args} onSelect={handleSelect} />;
  },
};

export const Range: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
    selected: {
      from: new Date(),
      to: new Date(Date.now() + 604800000), // This day next week
    },
  },
  argTypes: {
    numberOfMonths: {
      control: { min: 1, max: 12 },
    },
  },
  render: function Comp(args: DayPickerRangeProps) {
    const [, setArgs] = useArgs<DayPickerRangeProps>();

    const handleSelect = (range?: DateRange) => {
      setArgs({ selected: range });
    };

    return <Calendar {...args} onSelect={handleSelect} />;
  },
};

export const Multiple: Story = {
  args: {
    mode: 'multiple',

    // 10 random dates in the current month
    selected: (() => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      const randomDates = Array.from({ length: 10 }, () => {
        // Generate a random day within the current month
        const randomDay =
          Math.floor(Math.random() * new Date(currentYear, currentMonth + 1, 0).getDate()) + 1;
        return new Date(currentYear, currentMonth, randomDay);
      });

      return randomDates;
    })(),
  },
  render: function Comp(args: DayPickerMultipleProps) {
    const [, setArgs] = useArgs<DayPickerMultipleProps>();

    const handleSelect = (range?: Date[]) => {
      setArgs({ selected: range });
    };

    return <Calendar {...args} onSelect={handleSelect} />;
  },
};

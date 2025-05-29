import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePicker from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: 'Components/DatePicker',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    value: new Date('2023-01-01'),
    onChange: date => console.log('Date changed:', date),
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Select a date',
    onChange: () => {},
  },
};

const ControlledPicker = () => {
  const [value, setValue] = useState<Date | undefined>(new Date('2023-05-10'));
  return <DatePicker value={value} onChange={setValue} />;
};

export const Controlled: Story = {
  render: () => <ControlledPicker />,
};

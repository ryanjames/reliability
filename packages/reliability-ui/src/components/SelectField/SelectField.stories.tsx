import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import SelectField, { Select } from './SelectField';

const meta: Meta<typeof SelectField> = {
  title: 'Components/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  argTypes: {
    onValueChange: { action: 'value changed' },
  },
};

export default meta;

type Story = StoryObj<typeof SelectField>;

export const Default: Story = {
  args: {
    defaultValue: 'apple',
    children: (
      <>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the dropdown
    const trigger = await canvas.getByRole('combobox');
    await userEvent.click(trigger);

    // Select an item
    const option = await within(document.body).findByText('Banana');
    await userEvent.click(option);

    expect(trigger).toHaveTextContent('Banana');
  },
};

export const Controlled: Story = {
  args: {
    value: 'cherry',
    children: (
      <>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </>
    ),
  },
};

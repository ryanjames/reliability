import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import Input from './Input'; // assuming this file is named Input.tsx

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    display: {
      control: { type: 'select' },
      options: ['default', 'inline'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    display: 'default',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.getByPlaceholderText('Enter text...');

    await userEvent.type(input, 'Hello world');
    expect(input).toHaveValue('Hello world');
  },
};

export const Inline: Story = {
  args: {
    placeholder: 'Inline input',
    display: 'inline',
  },
};

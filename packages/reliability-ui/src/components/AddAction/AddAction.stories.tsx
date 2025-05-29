import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import AddAction from './AddAction';

const meta: Meta<typeof AddAction> = {
  title: 'Components/AddAction',
  component: AddAction,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AddAction>;

export const Default: Story = {
  args: {
    label: 'Add Task',
    onClick: () => {
      console.log('AddAction clicked');
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addAction = await canvas.findByText('Add Task');

    // Simulate clicking the add action
    await userEvent.click(addAction);

    // Expect the button to be present
    expect(addAction).toBeInTheDocument();
  },
};

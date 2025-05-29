import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import EditDelete from './EditDelete';

const meta: Meta<typeof EditDelete> = {
  title: 'Components/EditDelete',
  component: EditDelete,
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'edit clicked' },
    onDelete: { action: 'delete clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof EditDelete>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const buttons = canvas.getAllByRole('button', { hidden: true }); // If role="button" is used
    if (buttons.length === 0) {
      const spans = canvas.getAllByText(
        (_, element) =>
          element?.tagName.toLowerCase() === 'span' &&
          element?.classList.contains('cursor-pointer'),
      );
      await userEvent.click(spans[0]); // Edit
      await userEvent.click(spans[1]); // Delete
    } else {
      await userEvent.click(buttons[0]); // Edit
      await userEvent.click(buttons[1]); // Delete
    }
  },
};

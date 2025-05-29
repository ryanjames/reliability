import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import ProjectForm from './ProjectForm';

const meta: Meta<typeof ProjectForm> = {
  title: 'Components/ProjectForm',
  component: ProjectForm,
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectForm>;

export const Default: Story = {
  args: {
    initialTitle: 'Existing Project',
    submitLabel: 'Update',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the input by its value
    const input = await canvas.getByDisplayValue('Existing Project');
    await userEvent.clear(input);
    await userEvent.type(input, 'New Project Title');

    // Press Enter to submit
    await userEvent.keyboard('{Enter}');

    expect(input).toHaveValue('New Project Title');
  },
};

export const EmptyInitial: Story = {
  args: {
    initialTitle: '',
    submitLabel: 'Create',
  },
};

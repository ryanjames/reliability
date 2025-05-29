// TaskForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import TaskForm from './TaskForm';

const meta: Meta<typeof TaskForm> = {
  title: 'Components/TaskForm',
  component: TaskForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof TaskForm>;

const mockProjects = [
  { id: 1, title: 'Inbox', is_inbox: 1 },
  { id: 2, title: 'Work', is_inbox: 0 },
  { id: 3, title: 'Personal', is_inbox: 0 },
];

export const Default: Story = {
  args: {
    projects: mockProjects,
    onSubmit: task => {
      console.log('Submitted task:', task);
    },
    onCancel: () => {
      console.log('Cancelled');
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const titleInput = await canvas.findByPlaceholderText('New project title');
    await userEvent.type(titleInput, 'Buy groceries');

    const description = await canvas.findByPlaceholderText('Description');
    await userEvent.type(description, 'Milk, eggs, and bread');

    const submitButton = await canvas.findByRole('button', { name: /save/i });
    await userEvent.click(submitButton);

    expect(titleInput).toHaveValue('Buy groceries');
    expect(description).toHaveValue('Milk, eggs, and bread');
  },
};

export const Prepopulated: Story = {
  args: {
    initialTask: {
      title: 'Update resume',
      description: 'Make sure to include new projects',
      priority: 2,
      due_date: new Date('2024-12-15').getTime(),
      project_id: 2,
    },
    projects: mockProjects,
    onSubmit: task => console.log('Updated task:', task),
    onCancel: () => console.log('Cancelled'),
    submitLabel: 'Update Task',
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import TaskItem from './TaskItem';
import { useState } from 'react';

const meta: Meta<typeof TaskItem> = {
  title: 'Components/TaskItem',
  component: TaskItem,
};

export default meta;

type Story = StoryObj<typeof TaskItem>;

const TaskItemInteractive = (args: React.ComponentProps<typeof TaskItem>) => {
  const [complete, setComplete] = useState(false);
  return <TaskItem {...args} complete={complete} onToggleComplete={setComplete} />;
};

export const Default: Story = {
  render: args => <TaskItemInteractive {...args} />,
  args: {
    title: 'Write Storybook Stories',
    description: 'For all reusable components',
    priority: 2,
    dueDate: new Date().getTime(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = await canvas.findByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  },
};

const TaskItemCompleted = (args: React.ComponentProps<typeof TaskItem>) => {
  const [complete, setComplete] = useState(true);
  return <TaskItem {...args} complete={complete} onToggleComplete={setComplete} />;
};

export const Completed: Story = {
  render: args => <TaskItemCompleted {...args} />,
  args: { ...Default.args },
};

export const Overdue: Story = {
  render: args => <TaskItemInteractive {...args} />,
  args: {
    ...Default.args,
    dueDate: new Date().setDate(new Date().getDate() - 1),
  },
};

export const NoDueDate: Story = {
  render: args => <TaskItemInteractive {...args} />,
  args: {
    ...Default.args,
    dueDate: undefined,
  },
};

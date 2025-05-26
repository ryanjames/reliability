import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import Button from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    intent: 'primary',
    children: 'Primary Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /primary button/i });

    await userEvent.click(button);
    await expect(button).toBeVisible();
  },
};

export const Secondary: Story = {
  args: {
    intent: 'secondary',
    children: 'Secondary Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /secondary button/i });

    await userEvent.click(button);
    await expect(button).toBeVisible();
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /small button/i });

    await userEvent.click(button);
    await expect(button).toBeVisible();
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /small button/i });

    await userEvent.click(button);
    await expect(button).toBeVisible();
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /large button/i });

    await userEvent.click(button);
    await expect(button).toBeVisible();
  },
};

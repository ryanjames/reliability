import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Priority1: Story = {
  args: {
    checked: false,
    priority: 1,
    onCheckedChange: () => {
      console.log('Priority 1 checkbox toggled');
    },
  },
};

export const Priority2: Story = {
  args: {
    checked: false,
    priority: 2,
    onCheckedChange: () => {
      console.log('Priority 2 checkbox toggled');
    },
  },
};

export const Priority3: Story = {
  args: {
    checked: false,
    priority: 3,
    onCheckedChange: () => {
      console.log('Priority 3 checkbox toggled');
    },
  },
};

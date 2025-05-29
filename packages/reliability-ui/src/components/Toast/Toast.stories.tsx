import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, waitFor } from '@storybook/test';
import { toast } from 'sonner';
import Toast from './Toast';

const meta: Meta<typeof Toast> = {
  component: Toast,
  tags: ['autodocs'],
  render: () => (
    <>
      <Toast />
      <button onClick={() => toast.success('Toast triggered!')}>Trigger toast</button>
    </>
  ),
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', { name: /trigger toast/i });
    await userEvent.click(button);

    await waitFor(() => {
      const toastEl = document.querySelector('[data-sonner-toast]');
      if (!toastEl || !toastEl.textContent?.includes('Toast triggered!')) {
        throw new Error('Toast not found');
      }
    });
  },
};

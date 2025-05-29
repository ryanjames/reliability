import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import Dialog from './Dialog';
import Button from '../Button';
import { useState } from 'react';

type DialogArgs = Pick<ComponentProps<typeof Dialog>, 'onConfirm' | 'onOpenChange'>;

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    onConfirm: { action: 'confirmed delete' },
    onOpenChange: { action: 'dialog open changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const DialogTriggerExample = (args: DialogArgs) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog
        open={open}
        onOpenChange={open => {
          setOpen(open);
          args.onOpenChange?.(open);
        }}
        onConfirm={() => {
          args.onConfirm?.();
          setOpen(false);
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: args => <DialogTriggerExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const openButton = await canvas.findByRole('button', { name: /open dialog/i });
    await userEvent.click(openButton);

    const deleteButton = await within(document.body).findByRole('button', { name: /delete/i });
    expect(deleteButton).toBeVisible();

    await userEvent.click(deleteButton);
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import Input from '../Input';
import { within, userEvent, expect } from '@storybook/test';
import { useState } from 'react';
import SubmitCancel from './SubmitCancel';

interface SubmitCancelProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
  title: string;
  initialTitle: string;
}

const meta: Meta<typeof SubmitCancel> = {
  title: 'Components/SubmitCancel',
  component: SubmitCancel,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SubmitCancel>;

function SubmitCancelStoryWrapper(args: SubmitCancelProps) {
  const [title, setTitle] = useState(args.initialTitle);

  return (
    <div className="flex gap-4 w-1/2">
      <Input display="inline" value={title} onChange={e => setTitle(e.target.value)} />
      <SubmitCancel
        {...args}
        title={title}
        onSubmit={t => {
          args.onSubmit(t);
          setTitle(t);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  args: {
    initialTitle: 'My Project',
    title: 'My Project',
    onSubmit: title => {
      console.log('Submitted title:', title);
    },
    onCancel: () => {
      console.log('Cancelled');
    },
  },
  render: args => <SubmitCancelStoryWrapper {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = await canvas.findByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'New Title');

    const icons = canvas.getAllByRole('img', { hidden: true });
    const submitIcon = icons[0]?.closest('span');
    if (!submitIcon) throw new Error('Submit icon not found');

    await userEvent.click(submitIcon);

    expect(input).toHaveValue('New Title');
  },
};

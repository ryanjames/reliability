import * as Dialog from '@radix-ui/react-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded bg-white shadow-lg p-6 space-y-4">
          <Dialog.Title className="text-lg font-medium">{title}</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600">{description}</Dialog.Description>
          <div className="flex justify-end gap-2 pt-4">
            <Dialog.Close asChild>
              <button className="border px-3 py-1 rounded">Cancel</button>
            </Dialog.Close>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import { useState, useEffect } from 'react';

interface ProjectFormProps {
  initialTitle?: string;
  onSubmit: (title: string) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ProjectForm({
  initialTitle = '',
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: ProjectFormProps) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (title.trim()) onSubmit(title.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center w-full">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="border px-2 py-1 w-full"
        autoFocus
      />
      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">
        {submitLabel}
      </button>
      <button type="button" onClick={onCancel} className="text-gray-600 px-3 py-1">
        Cancel
      </button>
    </form>
  );
}

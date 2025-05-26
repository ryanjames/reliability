import { useState, useEffect } from 'react';
import SubmitCancel from '../SubmitCancel';
import Input from '../Input';

interface ProjectFormProps {
  initialTitle?: string;
  onSubmit: (title: string) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ProjectForm({ initialTitle = '', onSubmit, onCancel }: ProjectFormProps) {
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
      <Input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        display="inline"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
        autoFocus
      />
      <SubmitCancel
        initialTitle={initialTitle}
        title={title}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </form>
  );
}

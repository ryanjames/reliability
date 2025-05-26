import { useEffect } from 'react';

interface SubmitCancelProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
  title: string;
  initialTitle: string;
}

const SubmitCancel = ({ onSubmit, onCancel, title, initialTitle }: SubmitCancelProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const hasChanged = title.trim() !== initialTitle.trim();

  return (
    <div className="flex gap-1.5 group">
      {hasChanged && (
        <span
          onClick={() => onSubmit(title)}
          className="inline-block cursor-pointer opacity-50 hover:opacity-100"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.57492 0.0134293C13.1908 -0.309965 17.3507 5.18473 15.5917 10.5383C13.626 16.5226 5.74533 17.9363 1.78298 13.0383C-2.32196 7.96362 1.09907 0.386384 7.57492 0.0134293ZM7.47536 1.01515C2.11217 1.43716 -0.813564 7.46952 2.21173 11.959C4.91134 15.9654 10.8564 16.029 13.6795 12.1297C17.1686 7.31082 13.4009 0.549082 7.47536 1.01515Z"
              fill="#000000"
            />
            <path
              d="M10.9245 5.51319C11.2627 5.45112 11.6754 5.94322 11.4103 6.2546L7.16274 10.4662C6.94561 10.5704 6.74949 10.4182 6.58439 10.2875C6.12812 9.92557 5.10852 8.89281 4.73279 8.43575C4.53468 8.19496 4.42711 8.02776 4.63374 7.7339C4.98544 7.23229 5.4212 7.75242 5.73539 8.03376C6.14213 8.39821 6.50885 8.83824 6.90809 9.2137L7.05017 9.25525L10.5613 5.75499C10.6463 5.6859 10.8269 5.53121 10.9245 5.51319Z"
              fill="#000000"
            />
          </svg>
        </span>
      )}
      <span onClick={onCancel} className="inline-block cursor-pointer opacity-50 hover:opacity-100">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.57512 0.0140407C13.1911 -0.308989 17.3509 5.18552 15.5922 10.5396C13.626 16.5237 5.74623 17.9372 1.78381 13.0396C-2.32191 7.96438 1.09936 0.386227 7.57512 0.0140407ZM7.47491 1.01523C2.11151 1.43758 -0.813708 7.46981 2.21172 11.9591C4.91146 15.9649 10.8561 16.0291 13.6791 12.1297C17.1675 7.3113 13.4005 0.548745 7.47491 1.01523Z"
            fill="black"
          />
          <path
            d="M5.65103 10.344C5.41553 10.1062 5.54681 9.84036 5.71316 9.61464C5.90758 9.3498 7.26145 8.13593 7.2815 8.02658L5.58088 6.23487C5.37144 5.81654 5.88352 5.27882 6.28137 5.63395L8.01105 7.25913C8.14132 7.25913 9.34388 5.92287 9.58639 5.73026C9.71466 5.62793 9.87501 5.48448 10.0494 5.51357C10.342 5.56273 10.6206 5.93792 10.4312 6.22484L8.74059 7.99047C8.72456 8.07975 9.83091 9.10803 9.98925 9.28359C10.2678 9.59257 10.7469 9.98382 10.3159 10.364C10.0754 10.5757 9.91108 10.5185 9.67057 10.353C9.10236 9.96275 8.6023 9.14515 8.01105 8.75791L6.23126 10.4322C6.0599 10.5587 5.79033 10.4844 5.65203 10.344H5.65103Z"
            fill="black"
          />
        </svg>
      </span>
    </div>
  );
};

export default SubmitCancel;

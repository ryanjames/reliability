interface AddActionProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const AddAction: React.FC<AddActionProps> = ({ label, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-1 text-sm cursor-pointer ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.36714 7.61479H12.6684C12.8099 7.61479 12.9876 7.78599 12.9985 7.94254C13.0093 8.0991 12.8756 8.38444 12.7071 8.38444H8.36714V12.7131C8.36714 12.8203 8.15381 12.9931 8.0371 13.0008C7.92039 13.0085 7.63441 12.872 7.63441 12.7517V8.38521H3.33313C3.31226 8.38521 3.12831 8.29575 3.10048 8.27107C2.8887 8.08136 3.03942 7.61556 3.29448 7.61556H7.63441V3.24755C7.63441 3.14807 7.85856 3.00462 7.96599 3C8.0827 2.99537 8.36791 3.1257 8.36791 3.24755V7.61402L8.36714 7.61479Z"
          fill="#000000"
        />
      </svg>
      <span className="inline-block">{label}</span>
    </div>
  );
};

export default AddAction;

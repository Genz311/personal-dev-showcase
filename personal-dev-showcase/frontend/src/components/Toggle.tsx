interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const Toggle = ({ enabled, onChange, label, description, disabled = false }: ToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        {label && (
          <span className="text-sm font-medium text-gray-700">{label}</span>
        )}
        {description && (
          <span className="text-sm text-gray-500">{description}</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        disabled={disabled}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export default Toggle;
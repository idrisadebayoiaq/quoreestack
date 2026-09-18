"use client";

export function ConfirmForm({
  action,
  fields,
  label = "Delete",
  message = "This cannot be undone. Continue?",
  className = "",
}: {
  action: (form: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  label?: string;
  message?: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button
        type="submit"
        className={`text-xs text-red-400 hover:text-red-300 ${className}`}
      >
        {label}
      </button>
    </form>
  );
}

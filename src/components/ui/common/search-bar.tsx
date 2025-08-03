import React from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSearchStart?: () => void; // optionnel, pour reset la page par exemple
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  onSearchStart,
}: SearchInputProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="border px-2 py-1 rounded w-full"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (onSearchStart) onSearchStart();
        }}
      />
    </div>
  );
}
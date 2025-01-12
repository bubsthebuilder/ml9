import React, { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function FormInput({ label, ...props }: FormInputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
      />
    </div>
  );
}
import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  name: string;
  error?: FieldError;
}

export function Input({ name, error, ...rest}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input id={name} type="text" value={rest.value || ""} {...rest} className="bg-zinc-900 py-3 px-4 rounded text-small placeholder:text-zinc-500" />
      {error && <span className="text-red-600 text-xs">{error.message}</span>}
    </div>
  )
}
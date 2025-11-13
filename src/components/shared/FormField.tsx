import * as React from 'react'

interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: 'text' | 'password' | 'email'
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  readOnly = false,
}) => {
  return (
    <div className="flex items-center gap-4">
      <label className="w-[84px] text-sm text-slate-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="flex-1 bg-slate-50 rounded px-3 py-2 text-sm"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
      />
    </div>
  )
}

export default FormField

import clsx from 'clsx'
import { Search } from 'lucide-react'
import { ComponentPropsWithoutRef, useId } from 'react'

interface InputProp extends ComponentPropsWithoutRef<'input'> {
  label: string
  showHelperText?: boolean
  helperText: string
  showSearchIcon?: boolean
  error?: boolean
  id?: string
}

const Input = ({
  helperText,
  showHelperText,
  label,
  showSearchIcon,
  error,
  id,
  className,
  ...props
}: InputProp) => {
  const autoId = useId()
  const inputId = id ?? autoId

  const inputCls = clsx(
    className,
    'w-full cursor-pointer text-preset-4-medium transition-all sm:min-w-[20rem] focus:outline-teal-700 rounded-lg border p-3 hover:bg-neutral-100 bg-neutral-0 border-neutral-500 shadow-xs',
    'dark:bg-neutral-600 dark:border-neutral-300 dark:hover:bg-neutral-500 dark:focus:outline-neutral-100',
    showSearchIcon && 'pl-10',
    error && 'border-red-700 dark:border-red-700',
  )

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-preset-4 dark:text-neutral-0 text-neutral-900">
          {label} <span className="text-teal-700 dark:text-neutral-100">*</span>
        </label>
      )}
      <div className="relative">
        {showSearchIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-500 dark:text-neutral-200">
            <Search data-testid="search-icon" className="size-5" />
          </span>
        )}
        <input id={inputId} className={inputCls} {...props} />
      </div>
      {showHelperText && (
        <span role="alert" className="text-preset-4-medium text-red-600">
          {helperText}
        </span>
      )}
    </div>
  )
}

export default Input

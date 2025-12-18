import clsx from 'clsx'

import { Checkbox } from '@/components/ui/checkbox'

export interface TagProps {
  id?: string
  label: string
  count?: number
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

const Tag = ({
  id,
  label,
  count,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  className,
}: TagProps) => {
  return (
    <label
      key={id}
      htmlFor={label}
      className={clsx(
        'group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2',
        'dark:hover:text-neutral-0 text-neutral-800 hover:bg-neutral-100/50 dark:text-neutral-100 dark:hover:bg-teal-800/40',
        'has-focus-visible:ring-2 has-focus-visible:ring-teal-600 has-focus-visible:outline-none',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <Checkbox
        id={label}
        disabled={disabled}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(v) => onCheckedChange?.(Boolean(v))}
        className={clsx(
          'peer',
          'data-[state=checked]:text-neutral-0 rounded-sm border-neutral-500 text-teal-700 hover:bg-neutral-300 data-[state=checked]:border-none dark:data-[state=checked]:bg-teal-700',
          'data-[state=checked]:bg-teal-700 dark:border-neutral-300 dark:hover:bg-teal-700',
        )}
      />
      <span className="text-preset-3 dark:peer-data-[state=checked]:text-neutral-0 flex-1 peer-data-[state=checked]:text-neutral-900">
        {label}
      </span>
      {typeof count === 'number' && (
        <span
          className={clsx(
            'text-preset-5 inline-flex h-6 min-w-6 items-center justify-center rounded-full border',
            'border-neutral-300 bg-neutral-100 text-neutral-800 peer-data-[state=checked]:text-neutral-900',
            'dark:peer-data-[state=checked]:text-neutral-0 dark:border-teal-800 dark:bg-neutral-600 dark:text-inherit',
          )}
          aria-label={`${count} bookmarks`}
        >
          {count}
        </span>
      )}
    </label>
  )
}

export default Tag

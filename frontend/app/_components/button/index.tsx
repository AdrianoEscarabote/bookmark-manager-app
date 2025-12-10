import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

import IconAdd from '@/components/ui/icons/icon-add'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  hierarchy: 'primary' | 'secondary'
  size: 'sm' | 'md' | 'icon'
  error?: boolean
  showIcon?: boolean
  icon?: React.ReactNode
}

const Button = ({
  hierarchy,
  size,
  className,
  error,
  showIcon = false,
  icon,
  ...props
}: ButtonProps) => {
  const sizeCls =
    size === 'icon'
      ? 'size-8 aspect-square p-0'
      : size === 'sm'
        ? 'px-3 py-2.5 min-h-[2.625rem]'
        : 'px-4 py-3 min-h-[2.875rem]'

  const baseCls =
    size === 'icon'
      ? 'inline-grid place-items-center leading-none'
      : 'inline-flex items-center justify-center gap-1 leading-none '

  const radiusCls = size === 'icon' ? 'rounded-md' : 'rounded-md'

  const iconSizeCls = size === 'icon' ? 'size-5' : size === 'sm' ? 'size-4' : 'size-5'

  const variantCls =
    hierarchy === 'primary'
      ? [
          'relative isolate overflow-hidden',
          radiusCls,
          'text-neutral-0',
          'before:content-[""] before:absolute before:inset-0 before:rounded-[inherit]',
          'before:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.10)]',
          error ? 'bg-red-700 hover:bg-red-800' : 'bg-teal-700 hover:bg-teal-800',
          'focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-neutral-0 focus-visible:ring-offset-2',
          error ? 'focus-visible:ring-offset-red-800' : 'focus-visible:ring-offset-teal-800',
          'dark:focus-visible:ring-offset-neutral-900',
          'transition-shadow',
        ].join(' ')
      : [
          'relative isolate overflow-hidden ',
          radiusCls,
          'before:content-[""] before:absolute before:inset-0 before:rounded-[inherit]',
          error
            ? [
                'text-neutral-0',
                'bg-red-700 hover:bg-red-800',
                'border border-red-800',
                'before:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.10)]',
                'focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-neutral-0 focus-visible:ring-offset-2 focus-visible:ring-offset-red-800',
                'dark:focus-visible:ring-offset-neutral-900',
              ].join(' ')
            : [
                'text-neutral-900 dark:text-neutral-0',
                'bg-neutral-0 hover:bg-neutral-100',
                'dark:bg-neutral-800 dark:hover:bg-neutral-600',
                'border border-neutral-400',

                'focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100',
                'dark:focus-visible:ring-teal-300 dark:focus-visible:ring-offset-neutral-900',
              ].join(' '),
          'transition-shadow',
        ].join(' ')

  const shouldShowIcon = size === 'icon' ? true : showIcon !== false
  const IconNode = icon ?? (
    <IconAdd
      className={twMerge(
        'block shrink-0 text-inherit',
        iconSizeCls,
        size !== 'icon' ? '-translate-y-[0.5px]' : '',
      )}
      aria-hidden
    />
  )

  return (
    <button
      className={twMerge(
        clsx(
          'text-preset-3 cursor-pointer transition-all duration-200',
          baseCls,
          sizeCls,
          variantCls,
          className,
        ),
      )}
      {...props}
    >
      {shouldShowIcon && IconNode}
      {size !== 'icon' && props.children}
    </button>
  )
}

export default Button

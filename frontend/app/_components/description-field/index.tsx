'use client'

import * as React from 'react'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  maxLength: number
  error?: string
  currentLength: number
}

const DescriptionField = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ label, maxLength, error, currentLength, id = 'description', ...rest }, ref) => {
    return (
      <div className="relative flex flex-col gap-1">
        <div className="flex flex-col gap-2">
          <Label htmlFor={id}>{label}</Label>
          <Textarea
            id={id}
            maxLength={maxLength}
            ref={ref}
            style={{
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              WebkitOverflowScrolling: 'touch',
            }}
            className={`bg-neutral-0 max-h-35 min-h-22.5 cursor-pointer resize-y border border-neutral-500 wrap-break-word focus:ring-teal-700 dark:border-neutral-300 dark:bg-neutral-600 dark:focus:ring-neutral-300 ${error ? 'border-red-700 dark:border-red-700' : ''}`}
            {...rest}
          />
        </div>
        <div className="flex w-full items-center justify-between">
          <p
            className={
              error
                ? 'text-preset-4-medium text-red-600'
                : 'text-preset-4-medium text-red-600 opacity-0'
            }
            aria-live="assertive"
          >
            {error ?? 'placeholder'}
          </p>

          <p className="text-preset-5 text-right text-neutral-800 dark:text-neutral-100">
            {currentLength}/{maxLength}
          </p>
        </div>
      </div>
    )
  },
)

DescriptionField.displayName = 'DescriptionField'

export default DescriptionField

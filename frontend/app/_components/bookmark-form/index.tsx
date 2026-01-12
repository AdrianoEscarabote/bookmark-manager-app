'use client'
import { Loader2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'

import { DialogFooter } from '@/components/ui/dialog'

import Button from '../button'
import DescriptionField from '../description-field'
import Input from '../input'

export type BookmarkFormValues = {
  title: string
  description: string
  url: string
  tags: string
}

type Props = {
  loading: boolean
  defaultValues?: Partial<BookmarkFormValues>
  submitLabel: string
  onSubmit: (values: BookmarkFormValues) => void
  handleOpenChange: (open: boolean) => void
}

const MAX_DESCRIPTION = 280

export function BookmarkForm({
  loading,
  defaultValues,
  submitLabel,
  onSubmit,
  handleOpenChange,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<BookmarkFormValues>({ defaultValues })

  const description = useWatch({ control, name: 'description', defaultValue: '' }) ?? ''

  const handleTagsKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== ' ') return
    e.preventDefault()
    const current = e.currentTarget.value.trimEnd()
    if (!current) return
    const next = current.endsWith(',') ? `${current} ` : `${current}, `
    setValue('tags', next)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="flex flex-col gap-5 md:gap-8">
        <div className="flex flex-col gap-5">
          <Input
            error={errors.title ? true : false}
            showHelperText={!!errors.title}
            helperText={errors.title?.message as string}
            label="Title"
            {...register('title', {
              required: 'Title is required',
            })}
          />

          <DescriptionField
            label="Description"
            maxLength={MAX_DESCRIPTION}
            error={errors.description?.message as string | undefined}
            currentLength={description.length}
            {...register('description', {
              required: 'Description is required',
              maxLength: {
                value: MAX_DESCRIPTION,
                message: `Description must be at most ${MAX_DESCRIPTION} characters`,
              },
            })}
          />

          <Input
            error={errors.url ? true : false}
            showHelperText={!!errors.url}
            helperText={errors.url?.message as string}
            label="Website URL"
            {...register('url', {
              required: 'URL is required',
              pattern: {
                value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/,
                message: 'Please enter a valid URL',
              },
            })}
          />
          <Input
            error={errors.tags ? true : false}
            showHelperText={!!errors.tags}
            helperText={errors.tags?.message as string}
            label="Tags"
            placeholder="e.g. design, learning, tools"
            onKeyDown={handleTagsKeyDown}
            {...register('tags', {
              required: 'At least one tag is required',
            })}
          />
        </div>

        <DialogFooter className="flex flex-row items-end gap-4 self-end">
          <Button
            type="button"
            hierarchy="secondary"
            size="md"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" hierarchy="primary" size="md" disabled={loading}>
            {!loading && submitLabel}
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </fieldset>
    </form>
  )
}

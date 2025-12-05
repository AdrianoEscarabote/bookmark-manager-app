'use client'

import { useForm } from 'react-hook-form'

import Button from '@/app/_components/button'
import Input from '@/app/_components/input'

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <Input
        label="New Password"
        type="password"
        id="new-password"
        data-testid="new-password"
        {...register('newPassword', {
          required: 'New password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
          maxLength: {
            value: 24,
            message: 'Password must be at most 24 characters',
          },
        })}
        showHelperText={errors.newPassword?.message ? true : false}
        error={errors.newPassword ? true : false}
        helperText={errors.newPassword?.message as string}
      />
      <Input
        label="Confirm New Password"
        type="password"
        id="confirm-new-password"
        data-testid="confirm-password"
        {...register('confirmNewPassword', {
          required: 'Please confirm your new password',
          validate: (value) => {
            const newPassword = (document.getElementById('new-password') as HTMLInputElement).value
            return value === newPassword || 'Passwords do not match'
          },
        })}
        showHelperText={errors.confirmNewPassword?.message ? true : false}
        error={errors.confirmNewPassword ? true : false}
        helperText={errors.confirmNewPassword?.message as string}
      />
      <Button className="w-full max-w-none" hierarchy="primary" size="md">
        Reset password
      </Button>
    </form>
  )
}

export default ResetPasswordForm

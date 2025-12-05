'use client'

import { useForm } from 'react-hook-form'

import Button from '@/app/_components/button'
import Input from '@/app/_components/input'

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <Input
        label="Email"
        type="email"
        showHelperText={errors.email?.message ? true : false}
        error={errors.email ? true : false}
        helperText={errors.email?.message as string}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Invalid email address',
          },
        })}
        id="email"
      />
      <Button className="w-full max-w-none" hierarchy="primary" size="md">
        Send reset link
      </Button>
    </form>
  )
}

export default ForgotPasswordForm

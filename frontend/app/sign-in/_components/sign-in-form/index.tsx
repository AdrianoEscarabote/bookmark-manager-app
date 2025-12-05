'use client'

import { useForm } from 'react-hook-form'

import Button from '@/app/_components/button'
import Input from '@/app/_components/input'

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async (data) => {
    console.log(JSON.stringify(data))
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
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
        />
        <Input
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
            maxLength: {
              value: 24,
              message: 'Password must be at most 24 characters',
            },
          })}
          showHelperText={errors.password?.message ? true : false}
          error={errors.password ? true : false}
          helperText={errors.password?.message as string}
        />
        <Button hierarchy="primary" size="md" className="max-w-none" type="submit">
          Log in
        </Button>
      </div>
    </form>
  )
}

export default SignInForm

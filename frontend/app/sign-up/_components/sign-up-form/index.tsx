'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import Button from '@/app/_components/button'
import Input from '@/app/_components/input'
import { useBookmarksStore } from '@/app/_store/bookmarks'
import { api } from '@/utils/api'

const SignUpForm = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)
    try {
      const response = await api.post('/auth/sign-up', data)
      useBookmarksStore.getState().reset()
      if (response.status === 201) {
        router.push('/')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const payload = error.response?.data
        const message =
          typeof payload === 'string'
            ? payload
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ((payload as any)?.message ?? error.message ?? 'Error signing up')
        setServerError(message)
        setTimeout(() => {
          setServerError(null)
        }, 5000)
        return
      }
      setServerError('Error signing up')
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <div className="relative flex flex-col gap-4">
        <Input
          label="Full Name"
          type="text"
          id="name"
          showHelperText={errors.name?.message ? true : false}
          error={errors.name ? true : false}
          helperText={errors.name?.message as string}
          {...register('name', {
            required: 'Full Name is required',
            minLength: {
              value: 3,
              message: 'Full Name must be at least 3 characters',
            },
          })}
        />
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
        <Input
          label="Password"
          type="password"
          id="password"
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

        {serverError ? (
          <p className="text-preset-5 absolute top-0 right-0 z-40 text-red-600" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button hierarchy="primary" size="md" className="max-w-none" type="submit">
          Sign up
        </Button>
      </div>
    </form>
  )
}

export default SignUpForm

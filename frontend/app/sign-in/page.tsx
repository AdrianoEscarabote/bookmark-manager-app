export const metadata = {
  title: 'Sign in — Bookmark Manager',
  description: 'Sign in to your account to manage your bookmarks',
}

import Link from 'next/link'

import Logo from '@/components/ui/icons/logo'

import SignInForm from './_components/sign-in-form'

export default function SignIn() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 md:p-0">
      <h1 className="sr-only">Sign in to your account — Bookmark Manager</h1>

      <div className="bg-neutral-0 flex w-full max-w-md flex-col gap-8 rounded-[12px] px-5 py-6 md:px-8 md:py-10 dark:border dark:border-neutral-500 dark:bg-neutral-800">
        <Logo className="dark:text-neutral-0 text-neutral-900" />

        <div className="flex flex-col gap-2">
          <h2 className="text-preset-2 dark:text-neutral-0 text-neutral-900">
            Log in to your account
          </h2>
          <p className="text-neutral-800 dark:text-neutral-100">
            Welcome back! Please enter your details.
          </p>
        </div>

        <SignInForm />

        <div className="flex flex-col gap-3">
          <Link
            href="/demo"
            prefetch={false}
            className="dark:text-neutral-0 inline-flex w-full items-center justify-center rounded-[12px] border border-neutral-400 px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-600"
          >
            Try demo mode
          </Link>

          <p className="text-xs text-neutral-700 dark:text-neutral-200">
            Demo mode runs locally — changes won’t be saved to the database.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 text-center" aria-labelledby="auth-links">
          <h3 id="auth-links" className="sr-only">
            Authentication Links
          </h3>

          <p className="text-preset-4-medium flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100">
            Forgot password?
            <Link
              href="/forgot-password"
              className="dark:text-neutral-0 text-neutral-900 hover:underline focus:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Reset it
            </Link>
          </p>

          <p className="text-preset-4-medium flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100">
            Don’t have an account?
            <Link
              href="/sign-up"
              className="dark:text-neutral-0 text-neutral-900 hover:underline focus:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

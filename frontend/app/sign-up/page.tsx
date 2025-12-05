export const metadata = {
  title: 'Sign up — Bookmark Manager',
  description: 'Sign up to your account to manage your bookmarks',
}

import Link from 'next/link'

import Logo from '@/components/ui/icons/logo'

import SignUpForm from './_components/sign-up-form'

export default function SignUp() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 md:p-0">
      <h1 className="sr-only">Sign in to your account — Bookmark Manager</h1>

      <div className="bg-neutral-0 flex w-full max-w-md flex-col gap-8 rounded-[12px] px-5 py-6 md:px-8 md:py-10 dark:border dark:border-neutral-500 dark:bg-neutral-800">
        <Logo className="dark:text-neutral-0 text-neutral-900" />

        <div className="flex flex-col gap-2">
          <h2 className="text-preset-2 dark:text-neutral-0 text-neutral-900">
            Create your account
          </h2>
          <p className="text-neutral-800 dark:text-neutral-100">
            Join us and start saving your favorite links — organized, searchable, and always within
            reach.
          </p>
        </div>

        <SignUpForm />

        <div className="flex flex-col items-center gap-3 text-center" aria-labelledby="auth-links">
          <h3 id="auth-links" className="sr-only">
            Authentication Links
          </h3>

          <p className="text-preset-4-medium flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100">
            Already have an account?
            <Link
              href="/sign-in"
              className="dark:text-neutral-0 text-neutral-900 hover:underline focus:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

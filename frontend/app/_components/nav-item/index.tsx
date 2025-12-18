import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  count?: number
  active?: boolean
  className?: string
}

const NavItem = ({ href, icon, label, count, className }: NavItemProps) => {
  const pathName = usePathname()

  return (
    <Link
      href={href}
      className={clsx(
        'text-preset-3 flex min-h-[42px] items-center gap-2 rounded-lg px-4 py-2 transition-colors',
        'hover:bg-neutral-100 dark:hover:bg-neutral-600',
        `${pathName === href ? 'dark:text-neutral-0 bg-neutral-100 text-neutral-900 dark:bg-neutral-600' : 'bg-neutral-0 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100'}`,
        className,
      )}
      data-testid="nav-item"
    >
      <span>{icon}</span>
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={clsx(
            'ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full border px-2 text-xs',
            'border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-200',
          )}
        >
          {count}
        </span>
      )}
    </Link>
  )
}

export default NavItem

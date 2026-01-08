import * as React from 'react'
import { SVGProps } from 'react'

export default function IconAdd(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      aria-hidden
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

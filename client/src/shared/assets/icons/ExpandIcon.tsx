import type { SVGProps } from "react"

export function ExpandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 10l7-7m0 0h-4.5M21 3v4.5M10 14l-7 7m0 0h4.5M3 21v-4.5"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

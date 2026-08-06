import type { SVGProps } from "react";

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={100}
      height={100}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width={100} height={100} rx={50} fill="#ECB914" />
      <path
        d="M50 25C53.125 43.75 56.25 46.875 75 50C56.25 53.125 53.125 56.25 50 75C46.875 56.25 43.75 53.125 25 50C43.75 46.875 46.875 43.75 50 25Z"
        fill="#4F3D35"
      />
    </svg>
  );
}

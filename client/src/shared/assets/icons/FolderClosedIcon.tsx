import type { SVGProps } from "react";

export function FolderClosedIcon(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path
        d="
          M6 7
          H17.5
          C18.8 7 20 7.6 20.8 8.6
          L25.1 13.4
          C25.7 14.1 26.6 14.5 27.5 14.5
          H44
          C45.7 14.5 47 15.8 47 17.5
          V39.5
          C47 41.4 45.4 43 43.5 43
          H6
          C4.3 43 3 41.7 3 40
          V10
          C3 8.3 4.3 7 6 7
          Z
        "
        fill="currentColor"
      />
    </svg>
  );
}
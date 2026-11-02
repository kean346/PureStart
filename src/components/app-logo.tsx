import type { SVGProps } from "react";

/** Original geometric NOREVA monogram. */
export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
      aria-hidden="true"
      {...props}
      viewBox="0 0 32 32"
    >
      <path d="M7 25V7L25 25V7" stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="round" />
    </svg>
  );
}

import type { SVGProps } from "react";

/** Winglo geometric W monogram. */
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
      <path
        d="M4 8L10 25L16 12L22 25L28 8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}

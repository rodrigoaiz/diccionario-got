import type { SVGProps } from 'react';

export type IconName = 'arrow-up-right' | 'arrow-down' | 'arrow-left' | 'search' | 'empty' | 'theme';

type Props = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

export default function Icon({ name, size = 18, strokeWidth = 1.5, ...props }: Props) {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'arrow-up-right' && (
        <>
          <path d="M5 19 19 5" />
          <path d="M9 5h10v10" />
        </>
      )}
      {name === 'arrow-down' && (
        <>
          <path d="M12 4v15" />
          <path d="m6 13 6 6 6-6" />
        </>
      )}
      {name === 'arrow-left' && (
        <>
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle cx="10.8" cy="10.8" r="6.3" />
          <path d="m16 16 4 4" />
        </>
      )}
      {name === 'empty' && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="m7 7 10 10" />
        </>
      )}
      {name === 'theme' && <path d="M20 15.2A8 8 0 1 1 8.8 4 6.2 6.2 0 0 0 20 15.2Z" />}
    </svg>
  );
}

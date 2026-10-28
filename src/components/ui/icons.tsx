import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "square" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function ArrowRight({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M2.5 8h11" />
      <path d="M9.5 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowUpRight({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M4.5 11.5l7-7" />
      <path d="M5.5 4.5h6v6" />
    </svg>
  );
}

export function Download({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M8 2.5v7" />
      <path d="M5 7l3 3 3-3" />
      <path d="M3 12.5h10" />
    </svg>
  );
}

export function Copy({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <rect x="5.5" y="5.5" width="8" height="8" />
      <path d="M10.5 5.5V2.5h-8v8h3" />
    </svg>
  );
}

export function Check({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M2.5 8.5l3.5 3 7-7" />
    </svg>
  );
}

export function Menu({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} viewBox="0 0 20 20">
      <path d="M2.5 6.5h15" />
      <path d="M2.5 13.5h15" />
    </svg>
  );
}

export function Close({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })} viewBox="0 0 20 20">
      <path d="M4 4l12 12" />
      <path d="M16 4L4 16" />
    </svg>
  );
}

export function ArrowLeft({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M13.5 8h-11" />
      <path d="M6.5 4l-4 4 4 4" />
    </svg>
  );
}

export function ChevronDown({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M3.5 6l4.5 4.5L12.5 6" />
    </svg>
  );
}

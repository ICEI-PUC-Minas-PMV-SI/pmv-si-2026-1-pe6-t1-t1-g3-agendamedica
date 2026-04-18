import React from 'react'

export interface IconProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

type IconFC = React.FC<IconProps>

const ic = (body: React.ReactNode): IconFC => {
  return ({ size = 18, ...rest }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {body}
    </svg>
  )
}

export const Ic = {
  search: ic(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>,
  ),
  bell: ic(
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </>,
  ),
  plus: ic(<path d="M12 5v14M5 12h14" />),
  calendar: ic(
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>,
  ),
  calendarPlus: ic(
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4M12 14v4M10 16h4" />
    </>,
  ),
  clock: ic(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>,
  ),
  stethoscope: ic(
    <>
      <path d="M5 3v6a4 4 0 0 0 8 0V3" />
      <path d="M9 13v3a5 5 0 0 0 10 0v-1" />
      <circle cx="19" cy="14" r="2" />
    </>,
  ),
  history: ic(
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 8v5l3 2" />
    </>,
  ),
  user: ic(
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </>,
  ),
  settings: ic(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>,
  ),
  home: ic(<path d="M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z" />),
  pill: ic(
    <>
      <rect x="2" y="10" width="20" height="8" rx="4" transform="rotate(-45 12 14)" />
      <path d="m8.5 8.5 7 7" />
    </>,
  ),
  fileText: ic(
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8M8 17h5" />
    </>,
  ),
  heart: ic(
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />,
  ),
  mapPin: ic(
    <>
      <path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z" />
      <circle cx="12" cy="10" r="3" />
    </>,
  ),
  video: ic(
    <>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m22 8-6 4 6 4V8Z" />
    </>,
  ),
  chevron: ic(<path d="m9 6 6 6-6 6" />),
  chevDown: ic(<path d="m6 9 6 6 6-6" />),
  check: ic(<path d="m5 12 5 5L20 7" />),
  x: ic(<path d="M6 6l12 12M6 18 18 6" />),
  more: ic(
    <>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </>,
  ),
  inbox: ic(
    <>
      <path d="M3 13h5l2 3h4l2-3h5" />
      <path d="M5 5h14l2 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z" />
    </>,
  ),
  alertOct: ic(
    <>
      <path d="M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9Z" />
      <path d="M12 8v5M12 16.5v.1" />
    </>,
  ),
  slash: ic(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m5.5 5.5 13 13" />
    </>,
  ),
  refresh: ic(
    <>
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5M3 21v-5h5" />
    </>,
  ),
  arrow: ic(<path d="M5 12h14M13 5l7 7-7 7" />),
  logo: ic(<path d="M5 12h3l2-5 4 10 2-5h3" />),
  shield: ic(<path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6Z" />),
  sparkle: ic(
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />,
  ),
} as const

export type IcName = keyof typeof Ic

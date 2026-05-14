export type BackgroundVariant = 'none' | 'tint' | 'tile' | 'gradient'

export const backgroundVariants: Record<string, string> = {
  none: '',
  tint: 'bg-gray-100 dark:bg-gray-900',
  tile: '',
  gradient: 'mesh',
}

export const tileOverlay =
  'bg-[url(/images/tile-1-black.png)] dark:bg-[url(/images/tile-1-white.png)] bg-size-[5px] opacity-25'

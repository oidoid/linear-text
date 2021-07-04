import './icon.css'

export type IconProps = Readonly<{alt: string; src: string}>

export const iconSize = 20

export function Icon({alt, src}: IconProps) {
  return (
    <img
      alt={alt}
      className='icon'
      decoding='sync'
      height={iconSize}
      loading='eager'
      src={src}
      width={iconSize}
    />
  )
}

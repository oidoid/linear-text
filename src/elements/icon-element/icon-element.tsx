import './icon-element.css'

export type IconProps = Readonly<{alt: string; src: string}>

export const iconSize = 20

export function IconElement({alt, src}: IconProps): JSX.Element {
  return (
    <img
      alt={alt}
      className='icon-element'
      decoding='sync'
      height={iconSize}
      loading='eager'
      src={src}
      width={iconSize}
    />
  )
}

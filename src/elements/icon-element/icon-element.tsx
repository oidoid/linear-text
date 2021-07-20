import './icon-element.css'

export type IconElementProps = Readonly<{alt: string; src: string}>

export const iconSize = 20

export function IconElement({alt, src}: IconElementProps): JSX.Element {
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

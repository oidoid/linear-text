import './icon-element.css'

export type IconProps = Readonly<{alt: string; src: string; title?: string}>

export const iconSize = 20

export function IconElement({alt, src, title}: IconProps): JSX.Element {
  return (
    <img
      alt={alt}
      className='icon'
      decoding='sync'
      height={iconSize}
      loading='eager'
      src={src}
      title={title}
      width={iconSize}
    />
  )
}

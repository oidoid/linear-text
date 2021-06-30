import {useCallback, useMemo} from 'react'
import {Button, ButtonProps} from '../button/button'

export type ToggleProps = Omit<ButtonProps, 'onClick' | 'title'> &
  Readonly<{
    collapsed: boolean
    collapsedTitle: string
    expandedTitle: string
    onToggle(state: boolean): void
  }>

export function Toggle({
  collapsed,
  onToggle,
  collapsedTitle,
  expandedTitle,
  ...props
}: ToggleProps) {
  const onClick = useCallback(() => onToggle(!collapsed), [collapsed, onToggle])
  const title = useMemo(
    () => (collapsed ? collapsedTitle : expandedTitle),
    [collapsed, collapsedTitle, expandedTitle]
  )
  return (
    <Button active={!collapsed} onClick={onClick} title={title} {...props} />
  )
}

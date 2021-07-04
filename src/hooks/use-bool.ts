import {useCallback, useState} from 'react'

export function useBool(init: boolean) {
  const [val, set] = useState(init)
  const toggle = useCallback(() => set(state => !state), [])
  const setFalse = useCallback(() => set(false), [])
  const setTrue = useCallback(() => set(true), [])
  return {set, setFalse, setTrue, toggle, val}
}

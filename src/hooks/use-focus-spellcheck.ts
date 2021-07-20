import type React from 'react'

import {useCallback, useState} from 'react'

/** Enable spellchecking on focus and disable it on blur. */
export function useFocusSpellchecker<
  T extends HTMLInputElement | HTMLTextAreaElement
>(): {
  spellcheck: boolean
  onBlurSpellcheck: (ev: React.FocusEvent<T>) => void
  onFocusSpellcheck: (ev: React.FocusEvent<T>) => void
} {
  const [spellcheck, setSpellcheck] = useState(false)
  const onBlurSpellcheck = useCallback((ev: React.FocusEvent<T>) => {
    setSpellcheck(false)
    // Invalidate spellchecker squiggles.
    ev.currentTarget.setRangeText(ev.currentTarget.value)
  }, [])
  const onFocusSpellcheck = useCallback((ev: React.FocusEvent<T>) => {
    setSpellcheck(true)
    // Invalidate spellchecker squiggles.
    ev.currentTarget.setRangeText(ev.currentTarget.value)
  }, [])
  return {spellcheck, onBlurSpellcheck, onFocusSpellcheck}
}

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
    //
    // A previous implementation had a similar invalidation on focus too but it
    // caused the text to be duplicated 100% of the time in certain scenarios on
    // at least Chromium:
    //
    // 1. Focus a note in the middle of a group.
    // 2. Press enter to create a draft.
    // 3. Press tab to jump to the next note and dismiss the draft.
    //
    // At this point, the text will be "doubled". If the text is modified, the
    // double will be persisted into the model. If tabbed away, the text will
    // revert to the model. The issue doesn't occur on blur and the invalidation
    // only seems to be necessary for blurring. However, this bug indicates the
    // blur implementation may be a timebomb.
    ev.currentTarget.setRangeText(ev.currentTarget.value)
  }, [])
  const onFocusSpellcheck = useCallback(() => setSpellcheck(true), [])
  return {spellcheck, onBlurSpellcheck, onFocusSpellcheck}
}

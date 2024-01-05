import { css, type CSSResult } from 'npm:lit'

export const cssReset: CSSResult = css`
  *,
  *::after,
  *::before {
    box-sizing: border-box; /* Dimensions include any border and padding. */
  }
`

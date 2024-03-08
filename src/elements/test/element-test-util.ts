import {sendKeys} from '@web/test-runner-commands'

export async function pressKey(...keys: readonly string[]): Promise<void> {
  for (const key of keys) await sendKeys({press: key})
}

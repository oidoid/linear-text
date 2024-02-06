import {sendKeys} from '@web/test-runner-commands'

export async function pressKeys(...keys: string[]): Promise<void> {
  for (const key of keys) await sendKeys({press: key})
}

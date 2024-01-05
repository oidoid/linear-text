import { assertStrictEquals } from 'std/assert/mod.ts'
import { throttle } from './throttle.ts'

Deno.test('a throttled function is invoked with the latest arguments', async () => {
  const out = { val: 0 }
  const fn = throttle((val: number) => (out.val = val), 5)
  fn(1)
  assertStrictEquals(out.val, 0)
  await new Promise((resolve) => setTimeout(resolve, 0))
  assertStrictEquals(out.val, 1)
  fn(2)
  await new Promise((resolve) => setTimeout(resolve, 0))
  assertStrictEquals(out.val, 1)
  await new Promise((resolve) => setTimeout(resolve, 5))
  assertStrictEquals(out.val, 2)
})

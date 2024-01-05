import {
  assertEquals,
  assertNotStrictEquals,
  assertStrictEquals,
} from 'std/assert/mod.ts'
import { treeAdd, treeRemove, treeRoot, treeTouch } from './tree.ts'

type NumTree = {
  down?: undefined | NumTree[]
  n: number
  up?: NumTree | undefined
}

Deno.test('touch root', () => {
  //     0
  //    /|\
  //   1 2 3
  //  /  |
  // 4   5
  // |
  // 6
  // deno-fmt-ignore
  const i: NumTree[] = [{n: 0}, {n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}, {n: 6}]

  i[0]!.down = [i[1]!, i[2]!, i[3]!]

  i[1]!.up = i[0]
  i[2]!.up = i[0]
  i[3]!.up = i[0]
  i[1]!.down = [i[4]!]
  i[2]!.down = [i[5]!]

  i[4]!.up = i[1]
  i[5]!.up = i[2]
  i[4]!.down = [i[6]!]

  i[6]!.up = i[4]

  const node = treeTouch<NumTree>(i[0]!)
  assertStrictEquals(node.n, 0)
  const root = treeRoot<NumTree>(node)

  assertNotStrictEquals(root, i[0])
  assertStrictEquals(root.n, 0)

  assertStrictEquals(root.down![0], i[1])
  assertStrictEquals(root.down![1], i[2])
  assertStrictEquals(root.down![2], i[3])
  assertStrictEquals(root.down![0]!.down![0], i[4])
  assertStrictEquals(root.down![1]!.down![0], i[5])
  assertStrictEquals(root.down![0]!.down![0]!.down![0], i[6])
})

Deno.test('touch mid', () => {
  //     0
  //    /|\
  //   1 2 3
  //  /  |
  // 4   5
  // |
  // 6
  // deno-fmt-ignore
  const i: NumTree[] = [{n: 0}, {n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}, {n: 6}]

  i[0]!.down = [i[1]!, i[2]!, i[3]!]

  i[1]!.up = i[0]
  i[2]!.up = i[0]
  i[3]!.up = i[0]
  i[1]!.down = [i[4]!]
  i[2]!.down = [i[5]!]

  i[4]!.up = i[1]
  i[5]!.up = i[2]
  i[4]!.down = [i[6]!]

  i[6]!.up = i[4]

  const node = treeTouch<NumTree>(i[2]!)
  assertStrictEquals(node.n, 2)
  const root = treeRoot<NumTree>(node)

  assertNotStrictEquals(root, i[0])
  assertStrictEquals(root.n, 0)
  assertNotStrictEquals(root.down![1], i[2])
  assertStrictEquals(root.down![1]!.n, 2)

  assertStrictEquals(root.down![0], i[1])
  assertStrictEquals(root.down![2], i[3])
  assertStrictEquals(root.down![0]!.down![0], i[4])
  assertStrictEquals(root.down![1]!.down![0], i[5])
  assertStrictEquals(root.down![0]!.down![0]!.down![0], i[6])
})

Deno.test('touch leaf', () => {
  //     0
  //    /|\
  //   1 2 3
  //  /  |
  // 4   5
  // |
  // 6
  // deno-fmt-ignore
  const i: NumTree[] = [{n: 0}, {n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}, {n: 6}]

  i[0]!.down = [i[1]!, i[2]!, i[3]!]

  i[1]!.up = i[0]
  i[2]!.up = i[0]
  i[3]!.up = i[0]
  i[1]!.down = [i[4]!]
  i[2]!.down = [i[5]!]

  i[4]!.up = i[1]
  i[5]!.up = i[2]
  i[4]!.down = [i[6]!]

  i[6]!.up = i[4]

  const node = treeTouch<NumTree>(i[6]!)
  assertStrictEquals(node.n, 6)
  const root = treeRoot<NumTree>(node)

  assertNotStrictEquals(root, i[0])
  assertStrictEquals(root.n, 0)
  assertNotStrictEquals(root.down![0], i[1])
  assertStrictEquals(root.down![0]!.n, 1)
  assertNotStrictEquals(root.down![0]!.down![0], i[4])
  assertStrictEquals(root.down![0]!.down![0]!.n, 4)
  assertNotStrictEquals(root.down![0]!.down![0]!.down![0], i[6])
  assertStrictEquals(root.down![0]!.down![0]!.down![0]!.n, 6)

  assertStrictEquals(root.down![1], i[2])
  assertStrictEquals(root.down![2], i[3])
  assertStrictEquals(root.down![1]!.down![0], i[5])
})

Deno.test('remove', () => {
  //     0
  //    /|\
  //   1 2 3
  //  /  |
  // 4   5
  // |
  // 6
  // deno-fmt-ignore
  const i: NumTree[] = [{n: 0}, {n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}, {n: 6}]

  i[0]!.down = [i[1]!, i[2]!, i[3]!]

  i[1]!.up = i[0]
  i[2]!.up = i[0]
  i[3]!.up = i[0]
  i[1]!.down = [i[4]!]
  i[2]!.down = [i[5]!]

  i[4]!.up = i[1]
  i[5]!.up = i[2]
  i[4]!.down = [i[6]!]

  i[6]!.up = i[4]

  //   0
  //  /|\
  // 1 2 3
  //   |
  //   5
  // deno-fmt-ignore
  const e: NumTree[] = [{n: 0}, {n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}, {n: 6}]

  e[0]!.down = [e[1]!, e[2]!, e[3]!]

  e[1]!.up = e[0]
  e[2]!.up = e[0]
  e[3]!.up = e[0]
  e[1]!.down = []
  e[2]!.down = [e[5]!]

  e[5]!.up = e[2]

  treeRemove(i[4]!)
  assertEquals(i[0], e[0])
})

Deno.test('add', () => {
  //   0
  //  /|\
  // 1 2 3
  //   |
  //   5 4
  //     |
  //     6
  // deno-fmt-ignore
  const i: NumTree[] = [{n: 0}, {n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}, {n: 6}]

  i[0]!.down = [i[1]!, i[2]!, i[3]!]

  i[1]!.up = i[0]
  i[2]!.up = i[0]
  i[3]!.up = i[0]
  i[2]!.down = [i[5]!]

  i[5]!.up = i[2]
  i[4]!.down = [i[6]!]

  i[6]!.up = i[4]

  //   0
  //  /|\
  // 1 2 3
  //   | |
  //   5 4
  //     |
  //     6
  // deno-fmt-ignore
  const e: NumTree[] = [{n: 0}, {n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}, {n: 6}]

  e[0]!.down = [e[1]!, e[2]!, e[3]!]

  e[1]!.up = e[0]
  e[2]!.up = e[0]
  e[3]!.up = e[0]
  e[2]!.down = [e[5]!]
  e[3]!.down = [e[4]!]

  e[5]!.up = e[2]
  e[4]!.up = e[3]
  e[4]!.down = [e[6]!]

  e[6]!.up = e[4]

  treeAdd(i[4]!, i[3], 0)
  assertEquals(i[0], e[0])
})

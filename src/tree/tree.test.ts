import {expect, test} from 'vitest'
import {treeAdd, treeRemove, treeRoot, treeTouch} from './tree.js'

type NumTree = {
  down?: undefined | NumTree[]
  n: number
  up?: NumTree | undefined
}

test('touch root', () => {
  //     0
  //    /|\
  //   1 2 3
  //  /  |
  // 4   5
  // |
  // 6
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
  expect(node.n).toBe(0)
  const root = treeRoot<NumTree>(node)

  expect(root).not.toBe(i[0])
  expect(root.n).toBe(0)

  expect(root.down![0]).toBe(i[1])
  expect(root.down![1]).toBe(i[2])
  expect(root.down![2]).toBe(i[3])
  expect(root.down![0]!.down![0]).toBe(i[4])
  expect(root.down![1]!.down![0]).toBe(i[5])
  expect(root.down![0]!.down![0]!.down![0]).toBe(i[6])
})

test('touch mid', () => {
  //     0
  //    /|\
  //   1 2 3
  //  /  |
  // 4   5
  // |
  // 6
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
  expect(node.n).toBe(2)
  const root = treeRoot<NumTree>(node)

  expect(root).not.toBe(i[0])
  expect(root.n).toBe(0)
  expect(root.down![1]).not.toBe(i[2])
  expect(root.down![1]!.n).toBe(2)

  expect(root.down![0]).toBe(i[1])
  expect(root.down![2]).toBe(i[3])
  expect(root.down![0]!.down![0]).toBe(i[4])
  expect(root.down![1]!.down![0]).toBe(i[5])
  expect(root.down![0]!.down![0]!.down![0]).toBe(i[6])
})

test('touch leaf', () => {
  //     0
  //    /|\
  //   1 2 3
  //  /  |
  // 4   5
  // |
  // 6
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
  expect(node.n).toBe(6)
  const root = treeRoot<NumTree>(node)

  expect(root).not.toBe(i[0])
  expect(root.n).toBe(0)
  expect(root.down![0]).not.toBe(i[1])
  expect(root.down![0]!.n).toBe(1)
  expect(root.down![0]!.down![0]).not.toBe(i[4])
  expect(root.down![0]!.down![0]!.n).toBe(4)
  expect(root.down![0]!.down![0]!.down![0]).not.toBe(i[6])
  expect(root.down![0]!.down![0]!.down![0]!.n).toBe(6)

  expect(root.down![1]).toBe(i[2])
  expect(root.down![2]).toBe(i[3])
  expect(root.down![1]!.down![0]).toBe(i[5])
})

test('remove', () => {
  //     0
  //    /|\
  //   1 2 3
  //  /  |
  // 4   5
  // |
  // 6
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
  const e: NumTree[] = [{n: 0}, {n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}, {n: 6}]

  e[0]!.down = [e[1]!, e[2]!, e[3]!]

  e[1]!.up = e[0]
  e[2]!.up = e[0]
  e[3]!.up = e[0]
  e[1]!.down = []
  e[2]!.down = [e[5]!]

  e[5]!.up = e[2]

  treeRemove(i[4]!)
  expect(i[0]).toStrictEqual(e[0])
})

test('add', () => {
  //   0
  //  /|\
  // 1 2 3
  //   |
  //   5 4
  //     |
  //     6
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
  expect(i[0]).toStrictEqual(e[0])
})

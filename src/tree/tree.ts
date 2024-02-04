/** n-ary tree. Subtypes may specify nonnullish linkage if treeAdd() is used. */
export type Tree = {down?: undefined | Tree[]; up?: Tree | undefined}
/** Tree subtype with optional linkage. */
export type OptTree<T> = Omit<T, 'down' | 'up'> & Tree

/**
 * Add node to up.down[at]. A negative index counts back from the first item.
 * Returns node.
 */
export function treeAdd<T extends Tree>(
  node: OptTree<T>,
  up: T['up'],
  at: number
): T {
  node.up = up
  node.down ??= [] // Allow nonnullish linkage.
  if (!up) return <T>node
  up.down ??= []
  up.down.splice(at < 0 ? up.down.length + 1 + at : at, 0, node)
  return <T>node
}

/** Disconnect node from up. Return node. */
export function treeRemove<T extends Tree>(node: T): T {
  if (!node.up) return node
  const i = node.up.down?.indexOf(node) ?? -1
  if (i === -1) throw Error('up missing down tree')
  node.up.down!.splice(i, 1)
  return node
}

export function treeRoot<T extends Tree>(node: Tree): T {
  while (node.up) node = node.up
  return <T>node
}

/**
 * Shallow-copy every node from node upwards. Returns the node copy.
 *
 * Mutating any node in an immutable up-down tree would replace every node, even
 * an immutable down tree would replace every up node.
 */
export function treeTouch<T extends Tree>(node: Readonly<OptTree<T>>): T {
  const touched = {...node}
  for (const down of node.down ?? []) down.up = touched
  if (!node.up) return <T>touched
  const i = node.up.down?.indexOf(node) ?? -1
  if (i === -1) throw Error('up missing down tree')
  node.up.down![i] = touched
  treeTouch(node.up)
  return <T>touched
}

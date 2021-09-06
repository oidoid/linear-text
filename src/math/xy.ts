export type XY = {x: number; y: number}

export function XY(x: number, y: number): XY {
  return {x, y}
}

XY.format = (xy: Readonly<XY>): string => {
  return `(${xy.x}, ${xy.y})`
}

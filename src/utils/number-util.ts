import {assert} from './assert'

export type Interval =
  | 'inclusive'
  | 'exclusive'
  | 'inclusive-exclusive'
  | 'exclusive-inclusive'

export function assertDomain(
  num: number,
  min: number,
  max: number,
  interval: Interval
): void {
  assert(
    inDomain(num, min, max, interval),
    `${num} not in ${formatDomain(min, max, interval)}.`
  )
}

export function inDomain(
  num: number,
  min: number,
  max: number,
  interval: Interval
): boolean {
  return inDomainByInterval[interval](num, min, max)
}

export function formatDomain(
  min: number,
  max: number,
  interval: Interval
): string {
  const {start, end} = intervalBrackets[interval]
  return `${start}${min}, ${max}${end}`
}

const intervalBrackets = Object.freeze(<const>{
  inclusive: Object.freeze({start: '[', end: ']'}),
  exclusive: Object.freeze({start: '(', end: ')'}),
  'inclusive-exclusive': Object.freeze({start: '[', end: ')'}),
  'exclusive-inclusive': Object.freeze({start: '(', end: ']'})
})

const inDomainByInterval: Readonly<
  Record<Interval, (num: number, min: number, max: number) => boolean>
> = Object.freeze({
  inclusive: (num, min, max) => num >= min && num <= max,
  exclusive: (num, min, max) => num > min && num < max,
  'inclusive-exclusive': (num, min, max) => num >= min && num < max,
  'exclusive-inclusive': (num, min, max) => num > min && num <= max
})

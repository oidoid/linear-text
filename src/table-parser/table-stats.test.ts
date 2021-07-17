import {TableStats} from './table-stats'

test('initial states are zeroed and empty', () =>
  expect(TableStats()).toStrictEqual({
    columns: [],
    total: {text: 0, number: 0, bool: 0, blank: 0, empty: 0}
  }))

test('sampling type increments by one', () => {
  const stats = TableStats()
  TableStats.sample(stats, ['', ' ', 'false', '0', 'abc'])
  expect(stats).toStrictEqual({
    columns: [
      {text: 0, number: 0, bool: 0, blank: 0, empty: 1},
      {text: 0, number: 0, bool: 0, blank: 1, empty: 0},
      {text: 0, number: 0, bool: 1, blank: 0, empty: 0},
      {text: 0, number: 1, bool: 0, blank: 0, empty: 0},
      {text: 1, number: 0, bool: 0, blank: 0, empty: 0}
    ],
    total: {text: 1, number: 1, bool: 1, blank: 1, empty: 1}
  })
})

test('missing cells are not counted', () => {
  const stats = TableStats()
  const rows = [
    ['', ' ', 'false', '0', 'abc'],
    [],
    ['abc'],
    [],
    [],
    ['false', 'false', 'false', '100']
  ]
  TableStats.sample(stats, ...rows)
  expect(stats).toStrictEqual({
    columns: [
      {text: 1, number: 0, bool: 1, blank: 0, empty: 1},
      {text: 0, number: 0, bool: 1, blank: 1, empty: 0},
      {text: 0, number: 0, bool: 2, blank: 0, empty: 0},
      {text: 0, number: 2, bool: 0, blank: 0, empty: 0},
      {text: 1, number: 0, bool: 0, blank: 0, empty: 0}
    ],
    total: {text: 2, number: 2, bool: 4, blank: 1, empty: 1}
  })
})

test('a zero text mapping is not inferred', () => {
  const stats = {
    columns: [
      {text: 0, number: 1, bool: 2, blank: 3, empty: 4},
      {text: 0, number: 10, bool: 100, blank: 1000, empty: 10000},
      {text: 0, number: 0, bool: 1, blank: 0, empty: 0}
    ],
    total: {text: 0, number: 11, bool: 103, blank: 1003, empty: 10004}
  }
  expect(TableStats.inferMap(stats)).toStrictEqual({})
})

test('a nonzero text mapping is inferred from zero index', () => {
  const stats = {
    columns: [
      {text: 1000, number: 1, bool: 2, blank: 3, empty: 4},
      {text: 0, number: 10, bool: 100, blank: 1000, empty: 10000},
      {text: 100, number: 0, bool: 1, blank: 0, empty: 0}
    ],
    total: {text: 100, number: 11, bool: 103, blank: 1003, empty: 10004}
  }
  expect(TableStats.inferMap(stats)).toStrictEqual({text: 0})
})

test('a nonzero text mapping is inferred from non-zero index', () => {
  const stats = {
    columns: [
      {text: 1, number: 1, bool: 2, blank: 3, empty: 4},
      {text: 50, number: 10, bool: 100, blank: 1000, empty: 10000},
      {text: 100, number: 0, bool: 1, blank: 0, empty: 0}
    ],
    total: {text: 100, number: 11, bool: 103, blank: 1003, empty: 10004}
  }
  expect(TableStats.inferMap(stats)).toStrictEqual({text: 2})
})

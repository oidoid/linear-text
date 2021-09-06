import {ID} from '../id/id'
import {IDFactory} from '../id/id-factory'
import {Line} from '../line/line'
import {Group} from './group'

test('Removing a missing line fails.', () => {
  const factory = IDFactory()
  const group = Group(factory)
  expect(Group.hasLine(group, ID(1))).toStrictEqual(false)
  expect(() => Group.removeLine(group, 0)).toThrow()
})

test('Removing a matching line succeeds.', () => {
  const factory = IDFactory()
  const group = Group(factory, [
    Line(factory, 'abc'),
    Line(factory, 'def'),
    Line(factory, 'ghi')
  ])
  expect(Group.hasLine(group, ID(2))).toStrictEqual(true)
  expect(Group.removeLine(group, 1)).toStrictEqual({
    id: ID(2),
    text: 'def'
  })
  const expectedGroup: Group = {
    id: ID(4),
    lines: [
      {id: ID(1), text: 'abc'},
      {id: ID(3), text: 'ghi'}
    ]
  }
  expect(group).toStrictEqual(expectedGroup)
})

test('Line insertion of an empty group is successful.', () => {
  const factory = IDFactory()
  const group = Group(factory)
  const line = Line(factory, 'abc')
  Group.insertLine(group, line, 0)
  const expectedGroup: Group = {id: ID(1), lines: [{id: ID(2), text: 'abc'}]}
  expect(group).toStrictEqual(expectedGroup)
})

test.each(<const>[
  [
    'start',
    0,
    [
      {id: ID(5), text: '123'},
      {id: ID(1), text: 'abc'},
      {id: ID(2), text: 'def'},
      {id: ID(3), text: 'ghi'}
    ]
  ],
  [
    'middle',
    1,
    [
      {id: ID(1), text: 'abc'},
      {id: ID(5), text: '123'},
      {id: ID(2), text: 'def'},
      {id: ID(3), text: 'ghi'}
    ]
  ],
  [
    'end',
    3,
    [
      {id: ID(1), text: 'abc'},
      {id: ID(2), text: 'def'},
      {id: ID(3), text: 'ghi'},
      {id: ID(5), text: '123'}
    ]
  ]
])(
  'Line insertion at the %s of a non-empty group is successful.',
  (_, index: number, expectedLines: readonly Readonly<Line>[]) => {
    const factory = IDFactory()
    const group = Group(factory, [
      Line(factory, 'abc'),
      Line(factory, 'def'),
      Line(factory, 'ghi')
    ])
    const line = Line(factory, '123')
    Group.insertLine(group, line, index)
    expect(group).toStrictEqual({id: ID(4), lines: expectedLines})
  }
)

test('Non-contiguous line insertion fails.', () => {
  const factory = IDFactory()
  const group = Group(factory)
  const line = Line(factory, 'abc')
  expect(() => Group.insertLine(group, line, 1)).toThrow()
})

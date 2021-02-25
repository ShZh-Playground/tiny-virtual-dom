import { exec } from 'child_process'
import sum from '../src/index'

test('adds 1 + 2 to equals 3', () => {
  expect(sum(1, 2)).toBe(3);
})
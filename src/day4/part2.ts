import {readFileSync} from 'node:fs'
import { join } from 'node:path'

const rawInput = readFileSync(join(__dirname, './input.txt')).toString()

const puzzle = rawInput.split(/\n+/g).map((r) => r.split('')) // grid with 0,0 as top left char

const GROUPA = [[-1, -1], [1, 1]]
const GROUPB = [[1, -1], [-1, 1]]

function checkNeighbors(grid: string[][], x: number, y: number): boolean {
  if (y < 1 || y === grid.length -1 || x < 1 || x === grid[y].length - 1) {
    return false
  }
  const groupA = GROUPA.map(([nx, ny]) => grid[y + ny][x + nx]);
  const groupB = GROUPB.map(([nx, ny]) => grid[y + ny][x + nx]);

  if ([...groupA, ...groupB].every((letter) => letter === 'S' || letter === 'M')) {
    if (groupA[0] !== groupA[1] && groupB[0] !== groupB[1]) {
      return true
    }
  }
  return false
}


let totalMatches = 0
for (let y = 0; y < puzzle.length; y++) {
  for (let x = 0; x < puzzle[y].length; x++) {
    if (puzzle[y][x] === 'A') {
      totalMatches += checkNeighbors(puzzle, x, y) ? 1 : 0
    }
  }
}
console.log(totalMatches)
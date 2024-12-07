import {readFileSync} from 'node:fs'
import { join } from 'node:path'

const rawInput = readFileSync(join(__dirname, './input.txt')).toString()

const puzzle = rawInput.split(/\n+/g).map((r) => r.split('')) // grid with 0,0 as top left char

const LEFT = [-1, 0]
const RIGHT = [1, 0]
const UP = [0, -1]
const DOWN = [0, 1]
const LU = [-1, -1]
const LD = [-1, 1]
const RU = [1, -1]
const RD = [1, 1]

const MATCHER = ['X', 'M', 'A', 'S']

function findNeighbors(grid: string[][], x: number, y: number): [-1|0|1, -1|0|1][] {
  let dirs = [];
  const canLeft = x >= 3
  const canUp = y >= 3
  const canRight = x <= grid[y].length - 4
  const canDown = y <= grid.length - 4

  if (canLeft) {
    dirs.push(LEFT)
    if (canUp) {
      dirs.push(LU)
    }
    if (canDown) {
      dirs.push(LD)
    }
  }
  if (canRight) {
    dirs.push(RIGHT)
    if (canUp) {
      dirs.push(RU)
    }
    if (canDown) {
      dirs.push(RD)
    }
  }
  if (canUp) {
    dirs.push(UP)
  }
  if (canDown) {
    dirs.push(DOWN)
  }
  return dirs
}

function radialExplore(grid: string[][], x: number, y: number): number {

  const neigbors = findNeighbors(grid, x, y)

  let candidates = neigbors
  for (let i = 1; i < MATCHER.length; i++) {
    if (candidates.length < 1) {
      return 0;
    }
    candidates = candidates.filter(([dirX, dirY]) => {
      const neighbor = grid[y + (dirY * i)][x + (dirX * i)]
      if (neighbor === MATCHER[i]) {
        return true
      } else {
        return false
      }
    })
  }

  return candidates.length
}

let totalMatches = 0
for (let y = 0; y < puzzle.length; y++) {
  for (let x = 0; x < puzzle[y].length; x++) {
    if (puzzle[y][x] === 'X') {
      totalMatches += radialExplore(puzzle, x, y)
    }
  }
}
console.log(totalMatches)
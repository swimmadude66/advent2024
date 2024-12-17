import {readFileSync} from 'node:fs'
import { join } from 'node:path'

const rawInput = readFileSync(join(__dirname, './input.txt')).toString()
const floor = rawInput.split(/\n+/g).map((r) => r.split('')) // grid with 0,0 as top left char

interface Pos {
  x: number;
  y: number;
}

const LEFT = [-1, 0]
const RIGHT = [1, 0]
const UP = [0, -1]
const DOWN = [0, 1]

const GUARDS = ['^', '>', 'V', '<']

const dirs = [UP, RIGHT, DOWN, LEFT] // 90deg right rotation order
let dirIndex = 0

const visited = new Set<string>()

function coordsHaveObstacle(map: string[][], {x, y}: Pos): boolean {
  if (!isInBounds(map, {x, y})) {
    return false;
  }
  return map[y][x] === '#'
}

function tryMove(map: string[][], {x: startX, y: startY}: Pos): Pos {
  const currDir = dirs[dirIndex]
  const targetPos: Pos = {x: startX + currDir[0], y: startY + currDir[1]}
  if (coordsHaveObstacle(map, targetPos)) {
    dirIndex = (dirIndex + 1) % dirs.length
    return tryMove(map, { x: startX, y: startY})
  }
  return targetPos
}

function isInBounds(map: string[][], {x, y}: Pos) {
  return y >= 0 && y < map.length && x >= 0 && x < map[y].length
}

function exploreRoom(): {startingPos: Pos; directionIndex: number; obstacles: Pos[]} {
  const obstacles: Pos[] = []
  let startingPos: Pos;
  let directionIndex: number;
  for (let y = 0; y < floor.length; y ++) {
    for (let x = 0; x < floor[y].length; x++) {
      const tile = floor[y][x]
      const pos = {x, y}
      if (GUARDS.includes(tile)) {
        startingPos = pos
        directionIndex = GUARDS.indexOf(tile)
      } else if (tile === '#') {
        obstacles.push(pos)
      }
    }
  }

  return {startingPos, directionIndex, obstacles}
}

function trackGuard(startingPos: Pos, startDirInd: number) {
  let playerPos: Pos = startingPos
  playerPos = startingPos
  dirIndex = startDirInd

  while (isInBounds(floor, playerPos)) {
    visited.add(`${playerPos.x}, ${playerPos.y}`)
    playerPos = tryMove(floor, playerPos)
  }
  return visited
}

function pathHasCycle(map: string[][], startingPos: Pos, startDirInd: number) {
  const history = new Set<string>()
  let playerPos: Pos = startingPos
  playerPos = startingPos
  dirIndex = startDirInd

  while (isInBounds(map, playerPos)) {
    history.add(`${playerPos.x},${playerPos.y},${dirIndex}`)
    playerPos = tryMove(map, playerPos)
    if (history.has(`${playerPos.x},${playerPos.y},${dirIndex}`)) {
      return true
    }
  }
  return false
}


const {startingPos, directionIndex: startDirInd} = exploreRoom()

const visitedTiles = trackGuard(startingPos, startDirInd)
const obstacleCandidates: Pos[] = []
visitedTiles.forEach((posString) => {
    const [x,y] = posString.split(/\s*,\s*/).map((s) => +s)
    if (startingPos.x === x && startingPos.y === y) {
      return
    }
    const alteredMap = [...floor].map((f) => [...f])
    alteredMap[y][x] = '#'
    if (pathHasCycle(alteredMap, startingPos, startDirInd)) {
      obstacleCandidates.push({x, y})
    }

})


const trace = [...floor].map((f) => [...f])
obstacleCandidates.forEach((c) => trace[c.y][c.x] = '0')
console.log(trace.map((t) => t.join('')).join('\n'))

console.log({visitedTiles: visitedTiles.size, obstacleCandidates: obstacleCandidates.length})
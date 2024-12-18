import {readFileSync} from 'node:fs'
import { join } from 'node:path'

const rawInput = readFileSync(join(__dirname, './input.txt')).toString()
const map = rawInput.split(/\n+/g).map((r) => r.split('')) // grid with 0,0 as top left char

interface Pos {
  x: number;
  y: number;
}

function explodePairs(positions: Pos[], depth: number = 0, prefix: Pos[] =[]) {
  if (depth == 2) {
    return [prefix]
  };
  return positions.flatMap((pos, i) =>
    explodePairs(positions.slice(i+1), depth + 1, [...prefix, pos])
  );
}

function collectPairs(map: string[][]): Record<string, [Pos, Pos][]> {
  const antennas: Record<string, Pos[]> = {}
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = map[y][x]
      if (tile !== '.') {
        if (!(tile in antennas)) {
          antennas[tile] = []
        }
        antennas[tile].push({x, y})
      }
    }
  }
  
  const pairs = Object.fromEntries(Object.entries(antennas).flatMap(([freq, positions]) => {
    if (positions.length < 2) {
      return []
    }
    return [[freq, explodePairs(positions)]]
  }))

  return pairs
}

function isInBounds({x, y}: Pos, maxX: number, maxY: number): boolean {
  return  y >= 0 && y < maxY && x >= 0 && x < maxX
}


function calculateAntinodes(posA: Pos, posB: Pos, maxX: number, maxY: number): Pos[] {
  const xDist = posB.x - posA.x
  const yDist = posB.y - posA.y
  // const distance = Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2))
  const antinodes = [ {x: posB.x + xDist, y: posB.y + yDist}, {x: posA.x - xDist, y: posA.y - yDist} ]
  return antinodes.filter((a) => isInBounds(a, maxX, maxY))
}

function calculatePartTwoAntinodes(posA: Pos, posB: Pos, maxX: number, maxY: number): Pos[] {
  const xDist = posB.x - posA.x
  const yDist = posB.y - posA.y
  const antinodes = [ ]
  let originA = posA
  while (isInBounds(originA, maxX, maxY)) {
    antinodes.push(originA);
    originA = {x: originA.x - xDist, y: originA.y - yDist}
  }
  let originB = posB
  while (isInBounds(originB, maxX, maxY)) {
    antinodes.push(originB);
    originB = {x: originB.x + xDist, y: originB.y + yDist}
  }
  return antinodes
}

function main() {
  const maxY = map.length
  const maxX = map[0].length
  const pairMap = collectPairs(map)
  const allAntinodes = Object.values(pairMap).flatMap((pairs) => {
    return pairs.flatMap(([posA, posB]) => {
      return calculateAntinodes(posA, posB, maxX, maxY)
    })
  })
  const uniqLocations = new Set(allAntinodes.map(({x, y}) => `${x},${y}`))
  console.log({uniqLocations})

  const part2 = Object.values(pairMap).flatMap((pairs) => {
    return pairs.flatMap(([posA, posB]) => {
      return calculatePartTwoAntinodes(posA, posB, maxX, maxY)
    })
  })
  const pt2Locations = new Set(part2.map(({x, y}) => `${x},${y}`))
  console.log({pt2Locations})
  
}

function debug() {
  const maxY = map.length
  const maxX = map[0].length
  const pairMap = collectPairs(map)
  const trace = JSON.parse(JSON.stringify(new Array(maxY).fill(new Array(maxX).fill('.'))))
  Object.entries(pairMap).forEach(([freq, pairs]) => {
    pairs.forEach((pair) => {
      console.log(JSON.stringify(pair))
      const [posA, posB] = pair
      const antinodes = calculateAntinodes(posA, posB, maxX, maxY)
      antinodes.forEach((pos) => {
        trace[pos.y][pos.x] = '#'
      })

      trace[posA.y][posA.x] = freq
      trace[posB.y][posB.x] = freq
    })
  })
  const t: string = trace.map((t) => t.join('')).join('\n')
  console.log()
  const u = t.split('').reduce((total, c) => c === '#' ? total + 1 : total, 0)
  console.log({u})
}

main()
// debug()


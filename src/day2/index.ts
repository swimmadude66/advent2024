import {readFileSync} from 'node:fs'
import { join } from 'node:path'

const rawInput = readFileSync(join(__dirname, './input.txt')).toString()
const rows = rawInput.split(/\n+/g).filter(r => r)

function findBreak(steps: number[]): number {
  let brokenIndex = -1
  let direction = 0;
  for (let i = 1; i< steps.length; i++) {
    const prev = steps[i - 1];
    const change = steps[i] - prev;
    const mag = Math.abs(change)
    if (mag > 3 || mag < 1) {
      brokenIndex = i
      break;
    }
    const dir = change / mag
    if (!direction) {
      direction = dir
    }
    if (dir !== direction) {
      brokenIndex = i
      break;
    }
  }
  return brokenIndex
}

// this is disgusting, but I'm too lazy to mess with a more optimal way to check all the rules
function tryExcludingOne(orig: number[]): boolean {
  for (let i = 0; i<orig.length; i++) {
    const modified = orig.filter((_, index) => index !== i)
    const brokenIndex = findBreak(modified)
    if (brokenIndex < 0) {
      return true
    }
  }
  return false
}

let safeReports = 0
let dampedSafeReports = 0;
rows.forEach((row) => {
  const steps = row.split(/\s+/g).filter(s =>s).map((s) => +s)
 
  const brokenIndex = findBreak(steps)
  if (brokenIndex < 0) {
    safeReports ++;
    dampedSafeReports ++;
  } else {
    const canBeSaved = tryExcludingOne(steps)
    if (canBeSaved) {
      dampedSafeReports ++;
    }
  }
})

console.log('safeReports', safeReports)
console.log('dampedSafeReports', dampedSafeReports)
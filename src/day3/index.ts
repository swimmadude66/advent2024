import {readFileSync} from 'node:fs'
import { join } from 'node:path'

const rawInput = readFileSync(join(__dirname, './input.txt')).toString()

const multPattern = /mul\(\d{1,3},\d{1,3}\)/g

function doMath(expr: string): number {
  const [larg, rarg] = expr.replace(/mul\((\d{1,3}),(\d{1,3})\)/, `$1 x $2`).split(' x ').map((a) => +a)
  return (larg * rarg)
}

const matches = rawInput.match(multPattern)

const total = matches.reduce((t, expr) => {
  return t + doMath(expr)
}, 0)

console.log({total})

const flowControlPattern = /((do\(\))|(don't\(\))|(mul\(\d{1,3},\d{1,3}\)))/g
const flowControlMatches = rawInput.match(flowControlPattern)

let fcTotal = 0
let enabled = true
flowControlMatches.forEach((expr) => {
  if (expr === 'do()') {
    enabled = true
  } else if (expr === `don't()`) {
    enabled = false
  } else {
    if (enabled) {
      fcTotal += doMath(expr)
    }
  }
})

console.log({fcTotal})
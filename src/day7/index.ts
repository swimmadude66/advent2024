import {readFileSync} from 'node:fs'
import { join } from 'node:path'

const rawInput = readFileSync(join(__dirname, './input.txt')).toString()

const problems = rawInput.split(/\n+/g).filter((p) =>p)

type Operand = '+' | '*' | '||'

function evaluateExp(inputs: number[], ops: Operand[]) {
  let total = inputs.shift()
  const initialLength = inputs.length
  for (let i = 0; i < initialLength; i++) {
    const op = ops.shift()
    const arg = inputs.shift()
    // console.log(`${total} ${op} ${arg}`)
    if (op === '+') {
      total = total + arg
    } else if (op === '*') {
      total = total * arg
    } else if (op === '||') {
      total = +(`${total}${arg}`)
    }
  }
  return total
}

function generatePossibleOps(len: number): Operand[][] {
  const opSets: Operand[][] = []
  const totalOpsSets = Math.pow(3, len)
  for (let x = 0; x< totalOpsSets; x++) {
    let binString = (x >>> 0).toString(3)
    while (binString.length < len) {
      binString = `0${binString}`
    }
    opSets.push(binString.split('').map((c) => {
      if (c === '0') {
        return '+'
      } else if (c === '1') {
        return '*'
      } else {
        return '||'
      }
    }))
  }
  return opSets
}

function debug(inputs, ops, result) {
  const args = [...inputs]
  const o = [...ops]
  const out = []
  while (o.length) {
    out.push(args.shift())
    out.push(o.shift())
  }
  out.push(args.shift())
  console.log(out.join(' '), '=>', result)
}

function checkForOps(solution: number, inputs: number[]): boolean {
  const possibleOps = generatePossibleOps(inputs.length - 1)
  for (let ops of possibleOps) {
    const result = evaluateExp([...inputs], [...ops])
    if ( result === solution) {
      return true
    }
  }
  return false
}

function main(problems: string[]) {
  let totalValidSolutions = 0
  problems.forEach((ps) => {
  const [solution, ...inputs] = ps.split(/:?\s+/g).flatMap((n) => !n ? [] : [+n])

  if (checkForOps(solution, inputs)) {
    // total up the solutions
    totalValidSolutions += solution
  }

})

console.log({totalValidSolutions})
}

main(problems)

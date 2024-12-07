import {readFileSync} from 'node:fs'
import { join } from 'node:path'

const rawInput = readFileSync(join(__dirname, './input.txt')).toString()

const rows = rawInput.split(/\n+/g).filter(r => r)
const left: number[] = []
const right: number[] = []

rows.forEach((r) => {
  const [leftStr, rightStr] = r.split(/\s+/)
  left.push(Number.parseInt(leftStr.trim(), 10))
  right.push(Number.parseInt(rightStr.trim(), 10))
});

left.sort()
right.sort();

const totalDist = left.reduce((acc, l, i) => {
  const r = right[i]
  const dist = Math.abs(l - r)
  return acc + dist
}, 0)
console.log('total Distance', totalDist)

console.log(right)

const occurrenceCountMap = right.reduce((m, r) => {
  const prev = m[`${r}`] ?? 0
  m[`${r}`] = prev + 1
  return m
}, {})


const similarity = left.reduce((total, l) => {
  const freq = occurrenceCountMap[`${l}`] ?? 0
  return total + (l * freq)
}, 0)

console.log('similarity', similarity)

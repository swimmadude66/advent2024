import {readFileSync} from 'node:fs'
import { join } from 'node:path'

const rawInput = readFileSync(join(__dirname, './input.txt')).toString()
const [rules, rawJobs] = rawInput.split('\n\n').map((input) => input.split(/\n+/g).filter(r => r))

const priorRulesMap = rules.reduce((m, r) => {
  const [first, second] = r.split(/\s*\|\s*/g)
  if (!(first in m)) {
    m[first] = new Set()
  }
  m[first].add(second)
  return m
}, {})

const nextRulesMap = rules.reduce((m, r) => {
  const [first, second] = r.split(/\s*\|\s*/g)
  if (!(second in m)) {
    m[second] = new Set()
  }
  m[second].add(first)
  return m
}, {})


function checkOrder(job: string[]): boolean {
  const seen: string[] = []
  for (let i = 0; i < job.length; i++) {
    const mustFollows = priorRulesMap[job[i]] ?? new Set<string>()
    if (seen.some((s) => mustFollows.has(s))) {
      return false
    }
    seen.push(job[i])
  }
  return true
}

function sortJob(job: string[]): string[] {
  const output: string[] = []
  const unordered: string[] = [...job]
  while (unordered.length) {
    const earliestIndex = unordered.findIndex((j) => unordered.every((u) => !nextRulesMap[j].has(u)))
    output.push(unordered.splice(earliestIndex, 1)[0])
  }
  return output
}

function getMiddleNumber(arr: string[]): number {
  const middleIndex =  Math.floor(arr.length / 2)
  const middleNumber = +(arr[middleIndex])
  return middleNumber
}

const jobs = rawJobs.map((j) => j.split(/\s*,\s*/g))

let sortedMiddleSum = 0

const middleNumberSum = jobs.reduce((t, j) => {
  if (!checkOrder(j)) {
    const sorted = sortJob(j)
    const sortedMiddle = getMiddleNumber(sorted)
    sortedMiddleSum+=sortedMiddle
    return t
  }

  const middleNumber = getMiddleNumber(j)
  return t + middleNumber
}, 0)

console.log({middleNumberSum, sortedMiddleSum})
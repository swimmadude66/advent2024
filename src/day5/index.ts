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

const jobs = rawJobs.map((j) => j.split(/\s*,\s*/g))

const middleNumberSum = jobs.reduce((t, j) => {
  if (!checkOrder(j)) {
    return t
  }
  
  const middleIndex =  Math.floor(j.length / 2)
  const middleNumber = +(j[middleIndex])
  return t + middleNumber
}, 0)

console.log({middleNumberSum})
/**
 * [INPUT]: 依赖 fs 读取应用/页面/样式源码，依赖 src/pages/brain-bytes-terminal.js 的终端逐行输出纯函数
 * [OUTPUT]: 提供 Brain & Bytes OS 终端逐行启动、浏览器标题、论文档案叙事、无黑圆转场与独立展示路由的最小 Node 断言测试
 * [POS]: scripts/ 的轻量回归测试，守住入口终端不能一次性渲染完整内容、文案只服务论文展示、转场不再用黑底圆形裁切，并保证 standalone 构建根路径直达 OS
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  TERMINAL_BOOT_SEQUENCE,
  getTerminalLineTotal,
  getVisibleTerminalRows,
} from '../src/pages/brain-bytes-terminal.js'

const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const pageSource = readFileSync(new URL('../src/pages/BrainBytesOSPage.jsx', import.meta.url), 'utf8')
const osStyles = readFileSync(new URL('../src/pages/brain-bytes-os.css', import.meta.url), 'utf8')
const osAssetMap = readFileSync(new URL('../public/brain-bytes-os/CLAUDE.md', import.meta.url), 'utf8')
const curationSource = readFileSync(new URL('./brain-bytes-curation.js', import.meta.url), 'utf8')
const scriptsMap = readFileSync(new URL('./CLAUDE.md', import.meta.url), 'utf8')
const bootText = TERMINAL_BOOT_SEQUENCE.map((row) => row.text).join('\n')
const productText = [pageSource, bootText, osAssetMap, curationSource, scriptsMap].join('\n')
const fixedCountPattern = new RegExp(`\\bseven\\b|7\\s+living|7\\s+books|7\\s*(?:${'\\u4e2a'}\\s*)?${'\\u4e3b'}${'\\u9898'}|${'\\u4e03'}${'\\u672c'}|${'\\u4e03'}${'\\u4e2a'}`, 'i')
const temporaryPattern = /临时|暂时|当前主题书|固定数量|固定七/

assert.match(pageSource, /document\.title = 'Brain & Bytes OS'/)
assert.match(appSource, /VITE_BRAIN_BYTES_OS_STANDALONE/)
assert.match(appSource, /isBrainBytesOSStandalone \? <BrainBytesOSPage \/> : <LandingPage \/>/)
assert.doesNotMatch(productText, fixedCountPattern)
assert.doesNotMatch(bootText, /\bquestions?\b/i)
assert.doesNotMatch(osAssetMap, temporaryPattern)
assert.doesNotMatch(osStyles, /\.bbos-launch-field\s*\{[\s\S]*?background:\s*#02030a/)
assert.doesNotMatch(osStyles, /\.bbos-launch-field\s*\{[\s\S]*?clip-path:\s*circle/)
assert.doesNotMatch(osStyles, /@keyframes bbos-launch-reveal[\s\S]*?clip-path:\s*circle/)
assert.match(osStyles, /\.bbos-launch-field::before/)

const initial = getVisibleTerminalRows(0)
assert.equal(initial.length, TERMINAL_BOOT_SEQUENCE.length)
assert.equal(initial.every((row) => row.text === ''), true)
assert.equal(initial[0].cursor, true)

const firstLine = getVisibleTerminalRows(1)
assert.equal(firstLine[0].text, '$ whoami')
assert.equal(firstLine[0].active, true)
assert.equal(firstLine[0].cursor, false)
assert.equal(firstLine[1].text, '')
assert.equal(firstLine[1].cursor, true)

const secondLine = getVisibleTerminalRows(2)
assert.equal(secondLine[0].text, '$ whoami')
assert.equal(secondLine[0].active, false)
assert.equal(secondLine[1].text, '> reader inside a living paper archive')
assert.equal(secondLine[1].active, true)
assert.equal(secondLine[1].cursor, false)
assert.equal(secondLine[2].text, '')
assert.equal(secondLine[2].cursor, true)

const finished = getVisibleTerminalRows(getTerminalLineTotal())
assert.equal(finished.every((row) => row.done), true)
assert.deepEqual(finished.map((row) => row.text), TERMINAL_BOOT_SEQUENCE.map((row) => row.text))

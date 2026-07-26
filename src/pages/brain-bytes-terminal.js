/**
 * [INPUT]: 依赖 BrainBytesOSPage.jsx 的终端启动文案需求
 * [OUTPUT]: 对外提供 TERMINAL_BOOT_SEQUENCE、TERMINAL_LINE_STEP_MS、getTerminalLineTotal、getVisibleTerminalRows
 * [POS]: src/pages 的 Brain & Bytes OS 终端逐行启动引擎，把启动节奏从 React 渲染组件中剥离成可测试纯逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export const TERMINAL_LINE_STEP_MS = 760

export const TERMINAL_BOOT_SEQUENCE = [
  { kind: 'command', text: '$ whoami' },
  { kind: 'output', text: '> reader inside a living paper archive' },
  { kind: 'command', text: '$ scan ./brain-bytes/archive' },
  { kind: 'output', text: '> 56 papers · 1943-2026 · living archive' },
  { kind: 'command', text: '$ open brain-bytes.app' },
  { kind: 'output', text: '> loading orbital archive' },
  { kind: 'output', text: '> papers stay open · notes stay alive' },
  { kind: 'command', text: '$ enter global atlas' },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const getTerminalLineTotal = (rows = TERMINAL_BOOT_SEQUENCE) => rows.length

export function getVisibleTerminalRows(progress, rows = TERMINAL_BOOT_SEQUENCE) {
  const safeProgress = clamp(Math.floor(progress), 0, getTerminalLineTotal(rows))
  const total = getTerminalLineTotal(rows)
  const activeIndex = safeProgress === 0 ? 0 : Math.min(safeProgress - 1, rows.length - 1)
  const cursorIndex = safeProgress < total ? safeProgress : rows.length - 1

  return rows.map((row, index) => {
    const visible = index < safeProgress
    const active = index === activeIndex
    const cursor = index === cursorIndex

    return {
      ...row,
      text: visible ? row.text : '',
      active,
      cursor,
      done: visible,
    }
  })
}

/**
 * [INPUT]: 无（纯策展数据），由 generate-bytes-index.js import
 * [OUTPUT]: 导出 TOPICS（主题元数据：中文名/色/排序）与 SLUG_TOPICS（56 篇 slug→主题 映射）
 * [POS]: Brain & Bytes 站中站的「策展层」。主题分类是站点级策展决策（非文章自身属性），
 *        故集中在此维护，不写进 56 个自包含 HTML；索引器构建时据此给每篇打 topic 标签。
 * [PROTOCOL]: 新增文章时在 SLUG_TOPICS 补一行；主题增删改此文件与 TOPICS，然后检查 CLAUDE.md
 */

// 主题（key → 展示元数据）。color 为低饱和「学术图谱」分类色，与红色主调同处暖/沉稳色域，
// 刻意避开高饱和霓虹/彩虹，保持站中站的书卷气。order 决定主题视图分区顺序（大致按学科脉络）。
export const TOPICS = {
  electrophysiology: { name: '电生理 · 离子通道', short: '电生理', color: '#c0392b', order: 1 },
  perception:        { name: '感知 · 视觉',       short: '感知',   color: '#b9770e', order: 2 },
  computation:       { name: '计算 · 网络 · 学习', short: '计算',   color: '#8a6d3b', order: 3 },
  memory:            { name: '记忆 · 海马',       short: '记忆',   color: '#1f6f54', order: 4 },
  decision:          { name: '决策 · 前额叶 · 意志', short: '决策', color: '#a0522d', order: 5 },
  prediction:        { name: '预测 · 贝叶斯脑',   short: '预测',   color: '#2c6e9c', order: 6 },
  consciousness:     { name: '意识 · 主观经验',   short: '意识',   color: '#5b4b8a', order: 7 },
}

export const UNCLASSIFIED = { name: '未分类', short: '未分类', color: '#888888', order: 99 }

// slug → 主题 key。分类依据为每篇的英文论文标题语义（56 篇，人工策展）。
export const SLUG_TOPICS = {
  // 电生理 · 离子通道（4）——HH 1952 系列与膜电导
  'voltage-clamp-squid-axon': 'electrophysiology',
  'sodium-conductance-inactivation': 'electrophysiology',
  'sodium-potassium-currents': 'electrophysiology',
  'membrane-conductance-components': 'electrophysiology',

  // 感知 · 视觉（6）
  'infant-speech-perception': 'perception',
  'hubel-wiesel-receptive-fields': 'perception',
  'fusiform-face-area': 'perception',
  'deep-nets-visual-cortex': 'perception',
  'cooperative-stereo-vision': 'perception',
  'cortical-processing-hierarchy': 'perception',

  // 计算 · 网络 · 学习（12）
  'representational-similarity-analysis': 'computation',
  'neuron-doctrine-to-networks': 'computation',
  'neuronal-degeneracy-homeostasis': 'computation',
  'motor-population-vector': 'computation',
  'mcculloch-pitts-neuron': 'computation',
  'izhikevich-spiking-neuron': 'computation',
  'large-scale-neuronal-recording': 'computation',
  'hopfield-associative-memory': 'computation',
  'human-connectome': 'computation',
  'helmholtz-machine': 'computation',
  'backpropagation-learning': 'computation',
  'backpropagation-and-the-brain': 'computation',

  // 记忆 · 海马（9）
  'working-memory-model': 'memory',
  'taxi-driver-hippocampus': 'memory',
  'theta-rhythms-in-memory': 'memory',
  'short-term-memory-dissociation': 'memory',
  'patient-hm-hippocampus': 'memory',
  'medial-temporal-memory-system': 'memory',
  'long-term-potentiation': 'memory',
  'hippocampal-place-cells': 'memory',
  'engram-deconstruction': 'memory',

  // 决策 · 前额叶 · 意志（9）
  'unconscious-determinants-of-decisions': 'decision',
  'prefrontal-cognitive-control': 'decision',
  'neuroscience-of-volition': 'decision',
  'neural-basis-of-decision': 'decision',
  'md-thalamus-belief-updating': 'decision',
  'libet-readiness-potential': 'decision',
  'iowa-gambling-task': 'decision',
  'directed-attention-network': 'decision',
  'attractor-decision-dynamics': 'decision',

  // 预测 · 贝叶斯脑（6）
  'predictive-coding-visual-cortex': 'prediction',
  'predictive-processing-clark': 'prediction',
  'interoceptive-inference-self': 'prediction',
  'free-energy-principle': 'prediction',
  'dopamine-reward-prediction-error': 'prediction',
  'bayesian-object-perception': 'prediction',

  // 意识 · 主观经验（10）
  'what-is-it-like-to-be-a-bat': 'consciousness',
  'neurophenomenology': 'consciousness',
  'marys-room-knowledge-argument': 'consciousness',
  'integrated-information-theory': 'consciousness',
  'hard-problem-of-consciousness': 'consciousness',
  'higher-order-theories-consciousness': 'consciousness',
  'eliminative-materialism': 'consciousness',
  'consciousness-here-there-everywhere': 'consciousness',
  'conscious-preconscious-subliminal': 'consciousness',
  'awareness-in-vegetative-state': 'consciousness',
}

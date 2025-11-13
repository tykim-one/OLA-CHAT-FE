export type MarkdownSegment = {
  text: string
  isBold: boolean
}

export type AnalysisBlock =
  | {
      type: 'paragraph'
      segments: MarkdownSegment[]
    }
  | {
      type: 'list'
      items: MarkdownSegment[][]
    }

const trimTrailingSpaces = (value: string) => {
  return value.replace(/\s+$/g, '')
}

const doubleDotPattern = /[·\u00B7]{2}\s*/
const listMarkerPattern = /^[-*•·\u00B7][\t ]+/

const normalizeDoubleDots = (line: string) => {
  if (!line) {
    return line
  }

  if (!doubleDotPattern.test(line)) {
    return line
  }

  return line.replace(doubleDotPattern, '• ')
}

const isListMarker = (line: string) => {
  const normalizedLine = normalizeDoubleDots(line)

  return listMarkerPattern.test(normalizedLine)
}

const stripListMarker = (line: string) => {
  if (!line) {
    return line
  }

  return line.replace(listMarkerPattern, '').trimStart()
}

export const normalizeAnalysisMarkdown = (analysis: string | null | undefined): string | null => {
  if (!analysis) {
    return null
  }

  const cleaned = analysis
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => trimTrailingSpaces(line.trim()))

  const normalizedLines: string[] = []

  cleaned.forEach((rawLine) => {
    const line = normalizeDoubleDots(rawLine)

    if (!line) {
      if (normalizedLines.length === 0 || normalizedLines[normalizedLines.length - 1] === '') {
        return
      }

      normalizedLines.push('')
      return
    }

    if (isListMarker(line)) {
      const content = stripListMarker(line)
      normalizedLines.push(`- ${content}`)
      return
    }

    normalizedLines.push(line)
  })

  const finalValue = normalizedLines.join('\n').trim()

  if (!finalValue) {
    return null
  }

  return finalValue
}

export const splitBoldSegments = (text: string): MarkdownSegment[] => {
  const segments: MarkdownSegment[] = []

  const boldRegex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null = boldRegex.exec(text)

  while (match) {
    const [fullMatch, boldContent] = match
    const matchStart = match.index

    if (matchStart > lastIndex) {
      const plainText = text.slice(lastIndex, matchStart)
      segments.push({ text: plainText, isBold: false })
    }

    segments.push({ text: boldContent, isBold: true })

    lastIndex = matchStart + fullMatch.length
    match = boldRegex.exec(text)
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isBold: false })
  }

  if (segments.length === 0) {
    return [{ text, isBold: false }]
  }

  return segments
}

export const parseAnalysisMarkdown = (analysis: string | null | undefined): AnalysisBlock[] => {
  const normalized = normalizeAnalysisMarkdown(analysis)

  if (!normalized) {
    return []
  }

  const lines = normalized.split('\n')
  const blocks: AnalysisBlock[] = []
  let currentList: MarkdownSegment[][] | null = null

  const flushList = () => {
    if (!currentList || currentList.length === 0) {
      return
    }

    blocks.push({ type: 'list', items: currentList })
    currentList = null
  }

  lines.forEach((line) => {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      flushList()
      return
    }

    if (trimmedLine.startsWith('- ')) {
      const content = trimmedLine.slice(2).trim()
      if (!currentList) {
        currentList = []
      }
      currentList.push(splitBoldSegments(content))
      return
    }

    flushList()
    blocks.push({ type: 'paragraph', segments: splitBoldSegments(trimmedLine) })
  })

  flushList()

  return blocks
}

export const createMarkdownList = (items: Array<string | null | undefined>): string | null => {
  if (!items || items.length === 0) {
    return null
  }

  const cleanedItems = items.map((item) => (item ?? '').trim()).filter((item) => item.length > 0)

  if (cleanedItems.length === 0) {
    return null
  }

  const lines = cleanedItems.map((item) => {
    if (isListMarker(item)) {
      return item
    }

    return `- ${item}`
  })

  return lines.join('\n')
}

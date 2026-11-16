// Some streamed Markdown contains HTML-encoded spaces. Keep it as plain text.
export const normalizeChatWhitespace = (text: string): string =>
  text.replace(/&(?:#x0*(?:20|a0)|#0*(?:32|160)|nbsp);/gi, " ");

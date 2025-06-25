export function parseEmbedToMarkdown(blocks) {
  return `> ${blocks.embed}\n`;
}

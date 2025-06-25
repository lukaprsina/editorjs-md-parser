export function parseHeaderToMarkdown(blocks) {
  switch (blocks.level) {
    case 1:
      return `# ${blocks.text}\n`;
    case 2:
      return `## ${blocks.text}\n`;
    case 3:
      return `### ${blocks.text}\n`;
    case 4:
      return `#### ${blocks.text}\n`;
    case 5:
      return `##### ${blocks.text}\n`;
    case 6:
      return `###### ${blocks.text}\n`;
    default:
      break;
  }
}
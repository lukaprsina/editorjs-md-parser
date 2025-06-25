export function parseListToMarkdown(blocks) {
  let items = [];
  switch (blocks.style) {
    case 'unordered':
      items = blocks.items.map((item) => { return `- ${item}` });
      return '\n'+items.join('\n')+'\n';
    case 'ordered':
      items = blocks.items.map((item, index) => { return `${index + 1}. ${item}` });
      return '\n'+items.join('\n')+'\n';
    default:
      break;
  }
}
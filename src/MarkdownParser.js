export function parseEmbedToMarkdown(blocks) {
  return `${blocks.embed}\n`;
}

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

export function parseImageToMarkdown(blocks) {
  return `![${blocks.caption}](${blocks.url} "${blocks.caption}")`.concat("\n");
}

export function parseListToMarkdown(blocks) {
  let items = [];
  switch (blocks.style) {
    case "unordered":
      items = blocks.items.map((item) => {
        return `- ${item}`;
      });
      return "\n" + items.join("\n") + "\n";
    case "ordered":
      items = blocks.items.map((item, index) => {
        return `${index + 1}. ${item}`;
      });
      return "\n" + items.join("\n") + "\n";
    default:
      break;
  }
}

export function parseParagraphToMarkdown(blocks) {
  return `${blocks.text}\n`;
}

/**
 * Parse editor data blocks to markdown syntax
 */
export async function parseToMarkdown(blocks) {
  const parsedData = blocks.map((item) => {
    // iterate through editor data and parse the single blocks to markdown syntax
    switch (item.type) {
      case "header":
        return parseHeaderToMarkdown(item.data);
      case "paragraph":
        return parseParagraphToMarkdown(item.data);
      case "list":
        return parseListToMarkdown(item.data);
      case "image":
        return parseImageToMarkdown(item.data);
      case "embed":
        return parseEmbedToMarkdown(item.data);
      default:
        break;
    }
  });
  return parsedData.join("\n");
}

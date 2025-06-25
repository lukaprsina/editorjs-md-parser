export function parseEmbedToMarkdown(blocks) {
  const isVideo = blocks.service === "youtube" || blocks.service === "vimeo";
  if (isVideo) {
    return `<video src="${blocks.embed}" align="center" width="80%" isUpload="true" />\n`;
  }
  const filename =
    blocks.caption || blocks.source.substring(blocks.source.lastIndexOf("/") + 1);
  return `<file name="${filename}" src="${blocks.source}" align="center" width="80%" isUpload="true" />\n`;
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
  return `![${blocks.caption}](${blocks.file.url} "${blocks.caption}")\n`;
}

function parseListItems(items, style, level = 0, start = 1) {
  const indent = "  ".repeat(level);
  return items
    .map((item, index) => {
      const marker = style === "ordered" ? `${start + index}.` : "-";
      let listItem = `${indent}${marker} ${item.content}`;
      if (item.items && item.items.length > 0) {
        listItem += `\n${parseListItems(item.items, style, level + 1, 1)}`;
      }
      return listItem;
    })
    .join("\n");
}

export function parseListToMarkdown(blocks) {
  if (!blocks.items || blocks.items.length === 0) {
    return "\n";
  }
  const start = blocks.meta?.start || 1;
  return `${parseListItems(blocks.items, blocks.style, 0, start)}\n`;
}

export function parseParagraphToMarkdown(blocks) {
  let processedText = blocks.text || "";
  // convert anchor tags to markdown links
  processedText = processedText.replace(/<a href="([^\"]+)">([^<]+)<\/a>/g, "[$2]($1)");
  return `${processedText}\n`;
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

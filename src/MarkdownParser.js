export function parseEmbedToMarkdown(blocks) {
  const isVideo = blocks.service === "youtube" || blocks.service === "vimeo";
  if (isVideo) {
    return `<video align="center" src="${blocks.embed}" width="80%" isUpload="true" />`;
  }
  // For file embeds, use source if available, otherwise embed
  const src = blocks.source || blocks.embed;
  const filename = blocks.caption || src.substring(src.lastIndexOf("/") + 1);
  return `<file name="${filename}" align="center" src="${src}" width="80%" isUpload="true" />`;
}

export function parseHeaderToMarkdown(blocks) {
  switch (blocks.level) {
    case 1:
      return `# ${blocks.text}`;
    case 2:
      return `## ${blocks.text}`;
    case 3:
      return `### ${blocks.text}`;
    case 4:
      return `#### ${blocks.text}`;
    case 5:
      return `##### ${blocks.text}`;
    case 6:
      return `###### ${blocks.text}`;
    default:
      throw new Error(`Invalid header level: ${blocks.level}`);
      // return `### ${blocks.text}`; // Default to h3 if level is invalid
  }
}

export function parseImageToMarkdown(blocks) {
  const caption = blocks.caption || "";
  return `![${caption}](${blocks.file.url})`;
}

function parseListItems(items, style, level = 0, start = 1) {
  const indent = "  ".repeat(level);
  return items
    .map((item, index) => {
      const marker = style === "ordered" ? `${start + index}.` : "-";

      // Handle both string items and object items
      let content;
      let nestedItems = null;

      if (typeof item === "string") {
        content = item;
      } else if (typeof item === "object" && item !== null) {
        content = item.content || "";
        nestedItems = item.items;
      } else {
        content = "";
      }

      let listItem = `${indent}${marker} ${content}`;

      if (nestedItems && nestedItems.length > 0) {
        listItem += `\n${parseListItems(nestedItems, style, level + 1, 1)}`;
      }

      return listItem;
    })
    .join("\n");
}

export function parseListToMarkdown(blocks) {
  if (!blocks.items || blocks.items.length === 0) {
    return "";
  }
  const start = blocks.meta?.start || 1;
  return parseListItems(blocks.items, blocks.style, 0, start);
}

export function parseParagraphToMarkdown(blocks) {
  let processedText = blocks.text || "";
  // convert anchor tags to markdown links
  processedText = processedText.replace(/<a href="([^\"]+)">([^<]+)<\/a>/g, "[$2]($1)");
  return processedText;
}

/**
 * Parse editor data blocks to markdown syntax
 */
export async function parseToMarkdown(blocks) {
  const parsedData = blocks
    .map((item) => {
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
          return ""; // Return empty string for unknown block types
      }
    })
    .filter((block) => block !== ""); // Remove empty blocks

  return parsedData.join("\n\n"); // Double line breaks between blocks for PlateJS
}

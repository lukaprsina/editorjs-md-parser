import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

/**
 * Process text content to convert HTML links to markdown using unified ecosystem
 * This function handles HTML anchor tags anywhere in the text content
 */
function processTextWithLinks(text) {
  if (!text || typeof text !== "string") {
    return text || "";
  }

  // Check if text contains HTML anchor tags
  if (!text.includes("<a ")) {
    return text;
  }

  // try {
  // Wrap the text fragment in a paragraph to make it valid HTML
  const htmlContent = `<p>${text}</p>`;

  // Use unified to process HTML to Markdown
  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark)
    .use(remarkStringify, {
      bullet: "-",
      emphasis: "_",
      strong: "*",
      rule: "-",
      ruleRepetition: 3,
      ruleSpaces: false,
    });

  const result = processor.processSync(htmlContent);
  let processedText = String(result);

  processedText = processedText.replaceAll("\u00A0", " ");

  // Remove the wrapping paragraph tags that were added for processing
  processedText = processedText.replace(/^<p>/, "").replace(/<\/p>\s*$/, "");

  // Clean up any remaining newlines from processing
  processedText = processedText.replace(/\n+/g, " ").trim();

  return processedText;
  /* } catch (error) {
    console.warn('Failed to process HTML links with unified:', error);
    // Fallback to regex-based processing if unified fails
    return text.replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '[$2]($1)');
  } */
}

export function parseEmbedToMarkdown(blocks) {
  const isVideo = blocks.service === "youtube" || blocks.service === "vimeo";
  if (isVideo) {
    return `<video align="center" src="${blocks.embed}" width="80%" isUpload="true" />`;
  }
  // For file embeds, use source if available, otherwise embed
  const src = blocks.source || blocks.embed;
  const filename =
    processTextWithLinks(blocks.caption) ||
    src.substring(src.lastIndexOf("/") + 1);
  return `<file name="${filename}" align="center" src="${src}" width="80%" isUpload="true" />`;
}

export function parseHeaderToMarkdown(blocks) {
  const processedText = processTextWithLinks(blocks.text);
  switch (blocks.level) {
    case 1:
      return `# ${processedText}`;
    case 2:
      return `## ${processedText}`;
    case 3:
      return `### ${processedText}`;
    case 4:
      return `#### ${processedText}`;
    case 5:
      return `##### ${processedText}`;
    case 6:
      return `###### ${processedText}`;
    default:
      throw new Error(`Invalid header level: ${blocks.level}`);
    // return `### ${processedText}`; // Default to h3 if level is invalid
  }
}

export function parseImageToMarkdown(blocks) {
  const caption = processTextWithLinks(blocks.caption) || "";
  const altText = caption || "Image";
  const title = caption ? ` "${caption}"` : "";
  return `![${altText}](${blocks.file.url}${title})`;
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
        content = processTextWithLinks(item);
      } else if (typeof item === "object" && item !== null) {
        content = processTextWithLinks(item.content) || "";
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
  return processTextWithLinks(blocks.text || "");
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

import { parseEmbedToMarkdown } from "./BlockTypeParsers/EmbedTypeParser";
import { parseHeaderToMarkdown } from "./BlockTypeParsers/HeaderTypeParser";
import { parseImageToMarkdown } from "./BlockTypeParsers/ImageTypeParser";
import { parseListToMarkdown } from "./BlockTypeParsers/ListTypeParser";
import { parseParagraphToMarkdown } from "./BlockTypeParsers/ParagraphTypeParser";

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
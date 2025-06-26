# EditorJS to Markdown Parser - PlateJS Compatibility

## Changes Made

This parser has been modified to be compatible with PlateJS markdown format requirements.

### Key Fixes:

1. **Line Breaks**: Removed trailing `\n` from individual parsers and changed `parseToMarkdown` to use `\n\n` (double line breaks) between blocks, which is the standard markdown format that PlateJS expects.

2. **Header Parsing**: Added proper default case handling to prevent undefined returns.

3. **Image Parsing**: Improved handling of empty captions and proper markdown image syntax.

4. **Embed Parsing**:

   - Fixed video detection logic for YouTube and Vimeo
   - Separate handling for video vs file embeds
   - Videos use `<video>` MDX component with proper PlateJS attributes
   - Files use `<file>` MDX component with proper PlateJS attributes
   - Improved filename extraction from URLs

5. **List Parsing**:

   - Fixed to handle both EditorJS list formats:
     - Simple string arrays: `["item1", "item2", "item3"]`
     - Nested object format: `[{content: "item1", items: [...]}]`
   - Proper nested structure support
   - Removed unnecessary trailing newlines

6. **Paragraph Parsing**: Cleaned up HTML anchor tag to markdown link conversion.

7. **Main Parser**: Added filtering of empty blocks and proper error handling.

### MDX Components Used:

- `<video align="center" src="..." width="80%" isUpload="true" />` for video embeds
- `<file name="..." align="center" src="..." width="80%" isUpload="true" />` for file embeds

### Supported EditorJS Blocks:

- **header**: Converts to markdown headers (`# ## ### #### ##### ######`)
- **paragraph**: Converts to plain text with link conversion
- **image**: Converts to markdown image syntax with proper alt text and titles
- **list**: Converts to markdown lists (ordered and unordered) with nesting support
- **embed**: Converts to MDX components based on service type (video vs file)

### Test Results:

All parsing functions have been tested and validated to produce PlateJS-compatible markdown output.

- `test-parser.js`: Comprehensive test suite covering all block types and both list formats
- `test-real-data.js`: Test with real EditorJS data from Slovenian caving blog
- `examples/00_in.json`: Real EditorJS data sample
- `examples/00_out_corrected.mdx`: Correctly parsed output (compare with `00_out.mdx` to see the fix)

All tests pass successfully, ensuring robust parsing of diverse EditorJS content.

## Usage:

```javascript
import { parseToMarkdown } from "./src/MarkdownParser.js";

const editorJSBlocks = [
  // Your EditorJS blocks here
];

const markdown = await parseToMarkdown(editorJSBlocks);
console.log(markdown);
```

The output will be valid markdown/MDX that can be processed by PlateJS's markdown parser.

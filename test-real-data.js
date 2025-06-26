import fs from "fs";
import { parseToMarkdown } from "./src/MarkdownParser.js";

// Read the example input
const exampleData = JSON.parse(fs.readFileSync("./examples/00_in.json", "utf8"));

async function testWithRealData() {
  try {
    console.log("Testing with real EditorJS data...\n");

    const markdown = await parseToMarkdown(exampleData);

    console.log("Generated Markdown:");
    console.log("===================");
    console.log(markdown);
    console.log("===================\n");

    // Save the output
    fs.writeFileSync("./examples/00_out_corrected.mdx", markdown);
    console.log("✅ Output saved to examples/00_out_corrected.mdx");

    // Check if lists are properly parsed (should not contain "undefined")
    if (markdown.includes("undefined")) {
      console.log('❌ Lists still contain "undefined" - parsing failed');
    } else {
      console.log('✅ Lists parsed correctly - no "undefined" found');
    }
  } catch (error) {
    console.error("Error testing parser:", error);
  }
}

testWithRealData();

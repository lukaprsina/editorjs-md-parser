import fs from "fs";
import { parseToMarkdown } from "./src/MarkdownParser.js";

// Test data with HTML links in various EditorJS block types
const testBlocksWithLinks = [
	{
		type: "header",
		data: {
			text: 'Welcome to our <a href="https://example.com">awesome website</a>',
			level: 1,
		},
	},
	{
		type: "paragraph",
		data: {
			text: 'Visit our <a href="https://github.com/repo">GitHub repository</a> and check out the <a href="https://docs.example.com">documentation</a>.',
		},
	},
	{
		type: "list",
		data: {
			style: "unordered",
			items: [
				'First item with <a href="https://link1.com">link</a>',
				{
					content:
						'Second item with <a href="https://link2.com">another link</a>',
					meta: {},
					items: [
						'Nested item with <a href="https://nested.com">nested link</a>',
					],
				},
				"Third item without links",
			],
		},
	},
	{
		type: "list",
		data: {
			style: "ordered",
			items: [
				'Ordered item 1 with <a href="https://ordered1.com">link</a>',
				'Ordered item 2 with <a href="https://ordered2.com">another link</a>',
			],
		},
	},
	{
		type: "image",
		data: {
			file: {
				url: "https://example.com/image.jpg",
			},
			caption:
				'Image caption with <a href="https://caption-link.com">link in caption</a>',
			withBorder: false,
			withBackground: false,
			stretched: true,
		},
	},
	{
		type: "embed",
		data: {
			service: "coub",
			source: "https://example.com/document.pdf",
			embed: "https://example.com/document.pdf",
			width: 580,
			height: 320,
			caption:
				'Document with <a href="https://doc-link.com">link in caption</a>',
		},
	},
	{
		type: "paragraph",
		data: {
			text: 'Complex paragraph with multiple <a href="https://first.com">first link</a> and <a href="https://second.com">second link</a> and some <b>bold text</b>.',
		},
	},
];

async function testUnifiedLinksParser() {
	try {
		console.log(
			"Testing EditorJS to Markdown parser with unified ecosystem for HTML links...\n",
		);

		const markdown = await parseToMarkdown(testBlocksWithLinks);

		console.log("Generated Markdown:");
		console.log("===================");
		console.log(markdown);
		console.log("===================\n");

		// Test patterns for converted links
		const expectedPatterns = [
			// Header with link
			/^# Welcome to our \[awesome website\]\(https:\/\/example\.com\)/m,

			// Paragraph with multiple links
			/Visit our \[GitHub repository\]\(https:\/\/github\.com\/repo\) and check out the \[documentation\]\(https:\/\/docs\.example\.com\)/,

			// List items with links
			/^- First item with \[link\]\(https:\/\/link1\.com\)/m,
			/^- Second item with \[another link\]\(https:\/\/link2\.com\)/m,
			/^  - Nested item with \[nested link\]\(https:\/\/nested\.com\)/m,

			// Ordered list with links
			/^1\. Ordered item 1 with \[link\]\(https:\/\/ordered1\.com\)/m,
			/^2\. Ordered item 2 with \[another link\]\(https:\/\/ordered2\.com\)/m,

			// Image with link in caption (simplified pattern)
			/!\[Image caption with.*link in caption.*\]\(https:\/\/example\.com\/image\.jpg/,

			// File embed with link in caption
			/<file name="Document with \[link in caption\]\(https:\/\/doc-link\.com\)" align="center" src="https:\/\/example\.com\/document\.pdf" width="80%" isUpload="true" \/>/,

			// Complex paragraph with multiple links
			/Complex paragraph with multiple \[first link\]\(https:\/\/first\.com\) and \[second link\]\(https:\/\/second\.com\)/,
		];

		let passed = 0;
		let failed = 0;

		expectedPatterns.forEach((pattern, index) => {
			if (pattern.test(markdown)) {
				console.log(`✅ Test ${index + 1}: Link pattern matched correctly`);
				passed++;
			} else {
				console.log(
					`❌ Test ${index + 1}: Link pattern NOT matched - ${pattern}`,
				);
				console.log(`   Looking for pattern in:`);
				console.log(
					`   ${markdown.split("\n").find((line) => line.includes("http")) || "No matching line found"}`,
				);
				failed++;
			}
		});

		// Check that no HTML anchor tags remain
		if (markdown.includes("<a href=")) {
			console.log("❌ HTML anchor tags still present in output");
			failed++;
		} else {
			console.log("✅ All HTML anchor tags converted to markdown links");
			passed++;
		}

		console.log(`\nResults: ${passed} passed, ${failed} failed`);

		if (failed === 0) {
			console.log("🎉 All unified ecosystem link tests passed!");
		} else {
			console.log("⚠️ Some tests failed. Please review the output above.");
		}

		// Save the output for inspection
		fs.writeFileSync("./examples/unified_links_test_output.mdx", markdown);
		console.log("\n📁 Output saved to examples/unified_links_test_output.mdx");
	} catch (error) {
		console.error("Error testing unified links parser:", error);
	}
}

testUnifiedLinksParser();

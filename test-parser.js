import { parseToMarkdown } from './src/MarkdownParser.js';

// Test data based on EditorJS format
const testBlocks = [
  {
    "type": "header",
    "data": {
      "text": "Why Telegram is the best messenger",
      "level": 2
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "Check out our projects on a <a href=\"https://github.com/codex-team\">GitHub page</a>."
    }
  },
  {
    "type": "image",
    "data": {
      "file": {
        "url": "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg"
      },
      "caption": "Roadster // tesla.com",
      "withBorder": false,
      "withBackground": false,
      "stretched": true
    }
  },
  {
    "type": "list",
    "data": {
      "style": "unordered",
      "items": [
        {
          "content": "Apples",
          "meta": {},
          "items": [
            {
              "content": "Red",
              "meta": {},
              "items": []
            }
          ]
        },
        {
          "content": "Oranges",
          "meta": {},
          "items": []
        }
      ]
    }
  },
  {
    "type": "list",
    "data": {
      "style": "ordered",
      "meta": {
        "start": 2
      },
      "items": [
        {
          "content": "Second item",
          "meta": {},
          "items": []
        },
        {
          "content": "Third item",
          "meta": {},
          "items": []
        }
      ]
    }
  },
  {
    "type": "embed",
    "data": {
      "service": "youtube",
      "source": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "embed": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "width": 580,
      "height": 320,
      "caption": "Sample Video"
    }
  },
  {
    "type": "embed",
    "data": {
      "service": "coub",
      "source": "https://example.com/document.pdf",
      "embed": "https://example.com/document.pdf",
      "width": 580,
      "height": 320,
      "caption": "Sample Document"
    }
  }
];

async function testParser() {
  try {
    console.log('Testing EditorJS to Markdown parser...\n');
    
    const markdown = await parseToMarkdown(testBlocks);
    
    console.log('Generated Markdown:');
    console.log('===================');
    console.log(markdown);
    console.log('===================\n');
    
    // Basic validation
    const expectedPatterns = [
      /^## Why Telegram is the best messenger/m,
      /Check out our projects on a \[GitHub page\]\(https:\/\/github\.com\/codex-team\)/,
      /!\[Roadster \/\/ tesla\.com\]\(.*\)/,
      /^- Apples/m,
      /^  - Red/m,
      /^- Oranges/m,
      /^2\. Second item/m,
      /^3\. Third item/m,
      /<video align="center" src="https:\/\/www\.youtube\.com\/embed\/dQw4w9WgXcQ" width="80%" isUpload="true" \/>/,
      /<file name="Sample Document" align="center" src="https:\/\/example\.com\/document\.pdf" width="80%" isUpload="true" \/>/
    ];
    
    let passed = 0;
    let failed = 0;
    
    expectedPatterns.forEach((pattern, index) => {
      if (pattern.test(markdown)) {
        console.log(`✅ Test ${index + 1}: Pattern matched`);
        passed++;
      } else {
        console.log(`❌ Test ${index + 1}: Pattern NOT matched - ${pattern}`);
        failed++;
      }
    });
    
    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️ Some tests failed. Please review the output.');
    }
    
  } catch (error) {
    console.error('Error testing parser:', error);
  }
}

testParser();

// markdown-context.test.ts
import { expect, test } from 'vitest';
import { scanMarkdownFiles } from '../src/markdown-context'; // Assume you've exported this function.
import fs from 'node:fs'

test('scanMarkdownFiles should read and parse markdown files correctly', async () => {
  // Setup: Create a temporary markdown file with some front matter.
  const tempDir = 'temp/context';
  const tempFile = `${tempDir}/temp.md`;
  const frontMatter = {
    title: 'Test title',
    description: 'Test description',
  };
  fs.writeFileSync(tempFile, `---\n${JSON.stringify(frontMatter)}\n---`);

  // Call the function with the temporary directory.
  const directory = {};
  scanMarkdownFiles(tempDir, (file, parsedFrontMatter) => {
    directory[file] = parsedFrontMatter;
  });

  // Check that the directory object has been updated correctly.
  expect(directory).toEqual({
    'temp.md': frontMatter,
  });

  // Teardown: Delete the temporary markdown file.
  fs.unlinkSync(tempFile);
});
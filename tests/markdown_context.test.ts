// markdown-context.test.ts
import { afterAll, beforeAll, expect, test } from 'vitest';
import { scanMarkdownFiles, scanFiles } from '../src/markdown-context'; // Assume you've exported this function.
import fs from 'node:fs'
// import path from 'path';
// import matter from 'gray-matter';
// import { PluginOptions, FileDetails } from '../types/options';

import mockFs from 'mock-fs';

// Set up a mock filesystem
beforeAll(() => {
  mockFs({
    '/test-root': {
      'file1.md': '---\ntitle: Test1\nid: 123\n---\nContent1',
      'file2.md': '---\ntitle: Test2\nid: 456\n---\nContent2',
      'file3.txt': 'Not a markdown file',
    },
    '/output-directory': {}
  });
});

// Clean up the mock filesystem
afterAll(() => {
  mockFs.restore();
});

test('scanMarkdownFiles should correctly process markdown files', async () => {
  const options = {
    input: { 
      directory: '/test-root', 
      fileExtension: '.md', 
      recursive: true, 
      maxDepth: Infinity,
      encoding: 'utf-8',
      excludeFiles: [],
      ignoreHiddenFiles: true,
      metadataListDelimiter: ', '
    },
    output: { 
      directory: '/output-directory',
      metadataFilename: 'contents.json',
      includeContent: true,
      preserveDirectoryStructure: false,
      filenamingRule: "{dirname}_{filename}_{date}",
      extension: ".json",
      metadata: {},
      content: {},
      errorHandling: 'stop',
    },
    linkageStrategy: 'title',
  };
  
  scanMarkdownFiles('/test-root', options);

  const file1 = JSON.parse(fs.readFileSync('/output-directory/test1.json', 'utf-8'));
  const file2 = JSON.parse(fs.readFileSync('/output-directory/test2.json', 'utf-8'));
  const contents = JSON.parse(fs.readFileSync('/output-directory/contents.json', 'utf-8'));

  if (file1.data.title !== 'Test1') throw new Error('File1 title does not match.');
  if (file2.data.title !== 'Test2') throw new Error('File2 title does not match.');
  if (contents[0].title !== 'Test1') throw new Error('Contents[0] title does not match.');
  if (contents[1].title !== 'Test2') throw new Error('Contents[1] title does not match.');
});

test('scanFiles should correctly scan and filter files', async () => {
  let fileCount = 0;

  const fileHandler = () => {
    fileCount += 1;
  };

  scanFiles('/test-root', '.md', fileHandler);

  if (fileCount !== 2) throw new Error('File count does not match.');
});
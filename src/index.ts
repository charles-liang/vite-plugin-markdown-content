import * as fs from 'node:fs'
import * as path from 'node:path';
import { scanMarkdownFiles } from './markdown-context'

export default function MarkdownContextPlugin() {
  return {
    name: 'markdown-context',
    apply: 'build',
    configResolved(config) {
      if (config.command === 'build' || config.command === 'serve') {
        const markdownDir = path.resolve(__dirname, './context');
        const outputFilePath = path.resolve(__dirname, './public/contexts.json');
        const directory = {};
        
      
        scanMarkdownFiles(markdownDir, (file, frontMatter) => {
          // Ensure frontMatter has a 'title' property
          if (!frontMatter.title) {
            frontMatter.title = "Default Title";
          }
          directory[file] = frontMatter;
        });

        fs.writeFileSync(outputFilePath, JSON.stringify(directory, null, 2));
      }
    }
  };
};

import * as fs from 'node:fs'
import * as path from 'node:path';
import { scanMarkdownFiles } from './markdown-context'
import type {GrayMatterFile, Input} from 'gray-matter';

export default function MarkdownContextPlugin() {
  return {
    name: 'markdown-context',
    apply: (_config: any, _env: any) => {
    // determine whether to apply the plugin based on config and env
      return true; // or false
    },
    configResolved(config: { command: string; }) {
      if (config.command === 'build' || config.command === 'serve') {
        const markdownDir = path.resolve(__dirname, './context');
        const outputFilePath = path.resolve(__dirname, './public/contexts.json');
        const directory: Record<string, GrayMatterFile<Input>> = {};
        
      
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

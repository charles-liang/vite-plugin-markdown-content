import * as fs from 'node:fs'
import * as path from 'node:path';
import { ConfigEnv, Plugin, UserConfig } from 'vite';
import { scanMarkdownFiles } from './markdown-context.js'
import type {GrayMatterFile, Input} from 'gray-matter';

export default function playEntryPlugin(): Plugin {
  let config: { command: string, root: string };
  return {
    name: 'markdown-context',
    apply: ((config: UserConfig, env: ConfigEnv) =>  {
    // determine whether to apply the plugin based on config and env
      return true; // or false
    } ),

    configResolved(resolvedConfig: { command: string, root:string }): void {
      // store the resolved config
      config = resolvedConfig
      if (config.command === 'build' || config.command === 'serve') {
        const markdownDir =   path.resolve(config.root, './context');
        const outputFilePath = path.resolve(config.root, './public/contexts.json');
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
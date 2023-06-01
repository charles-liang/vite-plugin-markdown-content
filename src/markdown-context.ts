import matter from 'gray-matter';
import type {GrayMatterFile, Input} from 'gray-matter';

import * as fs from 'fs';
import * as path from 'path';

export function scanMarkdownFiles(dir: string, callback: { (file: string, frontMatter: GrayMatterFile<Input>): void; (arg0: string, arg1: any): void; }) {
    fs.readdirSync(dir).forEach(file => {
      const absolutePath = path.join(dir, file);
      if (fs.statSync(absolutePath).isDirectory()) {
        scanMarkdownFiles(absolutePath, callback);
      } else if (path.extname(absolutePath) === '.md') {
        const content = fs.readFileSync(absolutePath, 'utf-8');
        const frontMatter = matter(content).data;
        callback(file, frontMatter);
      }
    });
  }

import { ConfigEnv, Plugin, UserConfig } from 'vite';
import { scanMarkdownFiles } from './markdown-context.js'
import { PluginOptions } from './types/options'


export default function MarkdownContextPlugin(options: PluginOptions): Plugin {
  let config: { command: string, root: string };
  return {
    name: 'markdown-context',
    apply: ((config: UserConfig, env: ConfigEnv) =>  {
      return true; // or false
    } ),

    configResolved(resolvedConfig: { command: string, root:string }): void {
      config = resolvedConfig
      if (config.command === 'build' || config.command === 'serve') {
        scanMarkdownFiles(config.root, options)
      }
    }
  };
};
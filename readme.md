# ⚡ vite-plugin-markdown-context

[`vite`]: https://github.com/vitejs/vite

## Install

```bash
npm i vite-plugin-markdown-context -D
yarn add vite-plugin-markdown-context -D
```

## Usage

add this plugin to `vite.config.js`

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // not require 
import MarkdownContextPlugin from 'vite-plugin-markdown-context';

export default defineConfig({
  plugins: [
    react(), // not require
    MarkdownContextPlugin()],
})

##

## License

MIT
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { default: defineConfig } = require('vite');

function scanMarkdownFiles(dir, callback) {
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

module.exports = defineConfig({
  plugins: [{
    name: 'markdown-directory',
    apply: 'build',
    configResolved(config) {
      if (config.command === 'build' || config.command === 'serve') {
        const markdownDir = path.resolve(__dirname, './path/to/markdown');
        const outputFilePath = path.resolve(__dirname, './path/to/output.json');
        const directory = {};
        scanMarkdownFiles(markdownDir, (file, frontMatter) => {
          directory[file] = frontMatter;
        });
        fs.writeFileSync(outputFilePath, JSON.stringify(directory, null, 2));
      }
    }
  }]
});
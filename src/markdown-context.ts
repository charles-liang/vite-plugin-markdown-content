import fs from 'fs';
import path from 'path';
import matter, { GrayMatterFile } from 'gray-matter';
import type {  InputOptions, OutputOptions, PluginOptions } from './types/options';
import FileDetails from './FileDetails'

const defaultInputOptions: InputOptions = {
  directory: './content',
  fileExtension: '.md',
  recursive: true,
  maxDepth: Infinity,
  encoding: 'utf-8',
  excludeFiles: [],
  ignoreHiddenFiles: true,
  metadataListDelimiter: ', ',
};

const defaultOutputOptions: OutputOptions = {
  directory: './public/',
  metadataFilename: 'contents.json',
  dataDirectory: './content',
  includeContent: true,
  preserveDirectoryStructure: true,
  extension: ".json",
  errorHandling: 'stop',
  autoCleanUp: true,
  metadata: {},
  content: {},
};

const defaultPluginOptions: PluginOptions = {
  input: defaultInputOptions,
  output: defaultOutputOptions,
  linkageStrategy: 'filename',
};


export function scanMarkdownFiles(root: string, options: PluginOptions = defaultPluginOptions): void {
  // Create an array to store metadata of all markdown files
  const dataDirectory = path.join(options.output.directory, options.output.dataDirectory )
  if (options.output.autoCleanUp) {
    if (fs.existsSync(dataDirectory)) {
      fs.rmdirSync(dataDirectory, { recursive: true });
    }
  }

  // ensure output directory exists
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }


  let allMetaData: { [key: string]: any; }[] = [];
  
  const handleMarkdownFile = (fileDetails: FileDetails) => {
    // Read the content of the file
    const content = fs.readFileSync(fileDetails.absolutePath, 'utf-8');
    const frontMatter = matter(content);

    // Determine the id of the file
    let id: string;
    switch (options.linkageStrategy) {
      case 'uuid':
        // Use the existing id if it exists, otherwise generate a new one
        if (!frontMatter.data.id) {
          frontMatter.data.id =  generateId();
          // Write the new content to the file if a new id is generated
          const newContent = matter.stringify(frontMatter.content, frontMatter.data);
          fs.writeFileSync(fileDetails.absolutePath, newContent, 'utf-8');
        }

        id = frontMatter.data.id
        break;
      case 'title':
        // Generate an id from the title
        id = frontMatter.data.title.toLowerCase().replace(/\s+/g, '-');
        break;
      default:
        // Use the filename as the id
        id = path.basename(fileDetails.filename, '.md');
    }

    // Save metadata to the array
    const fileMetaData = {
      id: id,
      title: frontMatter.data.title,
      directory: options.output.preserveDirectoryStructure ? fileDetails.relativeDirectory : undefined,
    };
    allMetaData.push(fileMetaData);

    let outputDirectory = dataDirectory;

    if (options.output.preserveDirectoryStructure) {
      outputDirectory = path.join(dataDirectory, fileDetails.relativeDirectory);
      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }
    }


    // Save metadata and content to a new JSON file named by id
    const outputFilePath = path.join(outputDirectory, `${id}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(frontMatter), 'utf-8');
  };


    const handleSpecialMarkdownFile = (fileDetails: FileDetails) => {
      // Read the content of the file
      const outputDir =  path.join(path.dirname(fileDetails.absolutePath), "..", "layout")
      if (options.output.autoCleanUp) {
        if (fs.existsSync(outputDir)) {
          fs.rmdirSync(outputDir, { recursive: true });
        }
      }

      // ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }


      const content = fs.readFileSync(fileDetails.absolutePath, 'utf-8');
      const frontMatter = matter(content);

      // Generate a JSON file with the same name
      const jsonFilePath = path.join(outputDir, `${path.basename(fileDetails.filename, '.md')}.json`);
      fs.writeFileSync(jsonFilePath, JSON.stringify(frontMatter), 'utf-8');
    };

  scanFiles(path.join(root, options.input.directory), options.input.fileExtension, handleMarkdownFile, handleSpecialMarkdownFile);

  // Write all metadata to a JSON file
  const metadataFilePath = path.join(options.output.directory, 'contents.json');
  fs.writeFileSync(metadataFilePath, JSON.stringify(allMetaData), 'utf-8');
}

// Simple id generation - you can replace it with your own logic.
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}



export function scanFiles(root: string, fileExtension: string = '.md', fileHandler: (file: FileDetails) => void, handleSpecialMarkdownFile: (file: FileDetails) => void): void {
  function scan(dir: string) {
    fs.readdirSync(dir).forEach(file => {
      const absolutePath = path.join(dir, file);
      const relativePath = path.relative(root, dir);
      if (path.basename(file).startsWith('_')) {
        handleSpecialMarkdownFile(new FileDetails(root, relativePath, file));
      } else {
        fileHandler(new FileDetails(root, relativePath, file));
      }
    });
  }

  scan(root);
}
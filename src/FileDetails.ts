import path from 'node:path'

export default class FileDetails {
    public root: string;
    public relativeDirectory: string;
    public filename: string;
    public absolutePath: string;
  
    constructor(root: string, relativeDirectory: string, filename: string) {
      this.root = root;
      this.relativeDirectory = relativeDirectory;
      this.filename = filename;
      this.absolutePath = path.join(root, relativeDirectory, filename);
    }
  }
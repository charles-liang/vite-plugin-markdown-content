export interface MetadataStructure {
    [key: string]: "string" | "date" | ["string"];
}

export interface ContentStructur {
    [key: string]: "string";
}
  
export interface InputOptions {
    directory: string;
    fileExtension: string = '.md';
    recursive: boolean = true;
    maxDepth: number = Infinity;
    encoding: string = 'utf-8';
    excludeFiles: string[] = [];
    ignoreHiddenFiles: boolean = true;
    metadataListDelimiter: string = ', ';
    hook? : (FileDetails) => void;
}
  
export interface OutputOptions {
    directory: string;
    metadataFilename: string;
    dataDirectory: string;
    includeContent: boolean = true;
    preserveDirectoryStructure: boolean = true;
    extension: string = ".json"
    metadata: MetadataStructure;
    content:MetadataStructure;
    autoCleanUp: boolean = true;
    errorHandling: 'ignore' | 'stop' = 'stop';
    processFunction?: (input: any) => any;
    hook? : (FileDetails) => void;
}
  
export interface PluginOptions {
    input: InputOptions = {};
    output: OutputOptions = {};
    linkageStrategy: 'filename' | 'uuid' | 'title' = 'filename';
}

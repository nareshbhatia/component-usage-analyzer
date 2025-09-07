/**
 * Configuration for the component usage analyzer
 */
export interface Config {
  /** Absolute path to the git repository root */
  repoPath: string;

  /** Array of workspace paths relative to repository root (e.g., ["apps", "packages", "libs/ui"]) */
  workspacePaths: string[];

  /** Array of directory/file patterns to exclude from analysis */
  excludePaths: string[];

  /** Array of file extensions to analyze (e.g., [".js", ".jsx", ".ts", ".tsx"]) */
  fileExtensions: string[];

  /** Name of the React component to analyze usage for */
  componentName: string;

  /** Output path for the analysis results JSON file */
  jsonOutputPath: string;

  /** Output path for the analysis results Markdown file */
  mdOutputPath: string;

  /** Whether to enable verbose output */
  verbose: boolean;
}

/**
 * Validation result for configuration
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

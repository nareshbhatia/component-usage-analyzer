import type { AnalysisSummary } from './types';
import type { Config } from '../config/types';
import type { WorkspaceInfo } from '../types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Writes analysis results to a JSON file
 *
 * @param workspaces - The workspaces with analysis results
 * @param analysisSummary - The analysis summary
 * @param config - Configuration containing output path
 */
export function writeJsonResults(
  workspaces: WorkspaceInfo[],
  analysisSummary: AnalysisSummary,
  config: Config,
): void {
  try {
    // Resolve the output path relative to the current working directory
    const outputPath = path.resolve(config.jsonOutputPath);

    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const content = {
      workspaces,
      analysisSummary,
    };

    // Write the analysis results as formatted JSON
    const jsonContent = JSON.stringify(content, undefined, 2);
    fs.writeFileSync(outputPath, jsonContent, 'utf8');

    console.log(`\n📄 Analysis results written to: ${outputPath}`);
  } catch (error) {
    console.error(
      `❌ Error writing analysis results to file: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw error;
  }
}

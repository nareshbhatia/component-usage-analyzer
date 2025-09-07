import { calculatePackageReport } from './calculatePackageReport';
import type { AnalysisSummary } from './types';
import type { Config } from '../config/types';
import type { WorkspaceInfo } from '../types';
import { calculateWorkspaceSummary } from './calculateWorkspaceSummary';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generates markdown content from analysis results
 */
function generateMarkdownContent(
  workspaces: WorkspaceInfo[],
  analysisSummary: AnalysisSummary,
  config: Config,
): string {
  const { componentName, repoPath, excludePaths, fileExtensions } = config;
  const { fileWithInstanceCount, instanceCount, averageInstancesPerFile } =
    analysisSummary;

  let content = `# Component Usage Analysis: ${componentName}\n\n`;

  // Add timestamp
  content += `**Generated:** ${new Date().toISOString()}\n\n`;

  // Summary section
  content += `## Summary\n\n`;
  content += `**Total ${componentName} instances:** \`${instanceCount}\`  \n`;
  content += `**Total files with ${componentName} instances:** \`${fileWithInstanceCount}\`  \n`;
  content += `**Average ${componentName} instances / file:** \`${averageInstancesPerFile}\`\n\n`;

  // Configuration section
  content += `## Configuration\n\n`;
  content += `- **Repository Path:** \`${repoPath}\`\n`;
  content += `- **Workspaces:** ${workspaces.map((w) => `\`${w.relativePath}\``).join(', ')}\n`;
  content += `- **File Extensions:** ${fileExtensions.map((ext) => `\`${ext}\``).join(', ')}\n`;
  content += `- **Excluded Paths:** ${excludePaths.map((p) => `\`${p}\``).join(', ')}\n\n`;

  // Workspaces section
  content += `## Workspaces\n\n`;
  content += `| Workspace | Pkgs | Files | Instances | Aliases |\n`;
  content += `|-----------|-----:|------:|----------:|--------:|\n`;

  for (const workspace of workspaces) {
    const workspaceSummary = calculateWorkspaceSummary([workspace]);
    content += `| ${workspace.relativePath}| ${workspaceSummary.packageCount} | ${workspaceSummary.fileWithInstanceCount} | ${workspaceSummary.instanceCount} | ${workspaceSummary.importDeclarationWithAliasCount}|\n`;
  }
  content += `\n`;

  // Packages section
  const packageMetaSummaries = calculatePackageReport(workspaces);
  content += `## Packages\n\n`;
  content += `| Workspace | Package | Files | Instances | Aliases |\n`;
  content += `|-----------|---------|------:|----------:|--------:|\n`;

  for (const metaSummary of packageMetaSummaries) {
    content += `| ${metaSummary.workspaceName}| ${metaSummary.packageName} | ${metaSummary.summary.fileWithInstanceCount} | ${metaSummary.summary.instanceCount} | ${metaSummary.summary.importDeclarationWithAliasCount}|\n`;
  }
  content += `\n`;

  return content;
}

/**
 * Writes analysis results to a Markdown file
 *
 * @param workspaces - The workspaces with analysis results
 * @param analysisSummary - The complete analysis summary to write
 * @param config - Configuration containing output path
 */
export function writeMarkdownResults(
  workspaces: WorkspaceInfo[],
  analysisSummary: AnalysisSummary,
  config: Config,
): void {
  try {
    // Resolve the output path relative to the current working directory
    const outputPath = path.resolve(config.mdOutputPath);

    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate markdown content
    const markdownContent = generateMarkdownContent(
      workspaces,
      analysisSummary,
      config,
    );

    // Write the analysis results as markdown
    fs.writeFileSync(outputPath, markdownContent, 'utf8');

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

/**
 * Prints help information
 */
export function printHelp(): void {
  console.log(`
  🔍 Component Usage Analyzer
  
  Usage:
    compu [options]
  
  Options:
    --config=<path>          Specify config file path (default: compu-config.json)
    --create-config-example  Create an example configuration file
    --help, -h               Show this help message
  
  Examples:
    compu --config=my-compu-config.json
    compu --create-config-example
    compu --help
  `);
}

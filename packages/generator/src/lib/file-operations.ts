/**
 * File I/O operations with formatting support
 */

import { createStreaming } from '@dprint/formatter';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';

/**
 * Initialize dprint formatter with project configuration
 */
export async function initializeFormatter(projectRoot: string): Promise<any> {
  console.log('Initializing dprint formatter...');

  // Try to read local dprint config
  let dprintConfig: any = {
    typescript: {
      semiColons: 'prefer',
      quoteStyle: 'alwaysSingle',
      useBraces: 'whenNotSingleLine',
      bracePosition: 'sameLineUnlessHanging',
      singleBodyPosition: 'maintain',
      nextControlFlowPosition: 'nextLine',
      trailingCommas: 'onlyMultiLine',
      operatorPosition: 'nextLine',
      preferHanging: false,
      preferSingleLine: false,
    },
  };

  const dprintConfigPath = join(projectRoot, 'dprint.json');
  if (existsSync(dprintConfigPath)) {
    try {
      const configContent = readFileSync(dprintConfigPath, 'utf8');
      dprintConfig = JSON.parse(configContent);
      console.log('Using local dprint.json configuration');
    }
    catch (error) {
      console.warn('Failed to parse dprint.json, using defaults', error);
    }
  }

  // Get TypeScript plugin URL from config or use default
  const tsPluginUrl = dprintConfig.plugins?.find((p: string) => p.includes('typescript'))
    || 'https://plugins.dprint.dev/typescript-0.93.0.wasm';

  // Cache directory for WASM files
  const cacheDir = `${homedir()}/.cache/treant`;
  const urlHash = createHash('md5').update(tsPluginUrl).digest('hex');
  const cacheFile = `${cacheDir}/formatter-${urlHash}.wasm`;

  // Ensure cache directory exists
  if (!existsSync(cacheDir)) {
    require('node:fs').mkdirSync(cacheDir, { recursive: true });
  }

  let formatter;
  if (existsSync(cacheFile)) {
    // Use cached WASM file
    const wasmBuffer = readFileSync(cacheFile);
    formatter = await createStreaming(Promise.resolve(new Response(wasmBuffer)));
  }
  else {
    // Download and cache WASM file
    console.log('Downloading formatter (this is only needed once)...');
    const response = await fetch(tsPluginUrl);
    const buffer = await response.arrayBuffer();

    // Save to cache
    writeFileSync(cacheFile, Buffer.from(buffer));

    formatter = await createStreaming(Promise.resolve(new Response(buffer)));
  }

  // Configure formatter with project settings
  const globalConfig = {
    indentWidth: dprintConfig.typescript?.indentWidth || 2,
    lineWidth: dprintConfig.typescript?.lineWidth || 120,
  };

  formatter.setConfig(globalConfig, dprintConfig.typescript || {});
  return formatter;
}

/**
 * Write a formatted TypeScript file with error handling
 */
export async function writeFormattedFile(
  filePath: string,
  content: string,
  formatter: any,
): Promise<void> {
  try {
    // formatText is synchronous, not async
    const formatted = formatter.formatText(filePath, content);
    writeFileSync(filePath, formatted || content, 'utf8');
  }
  catch (error) {
    console.warn(`Warning: Failed to format ${filePath}, writing unformatted`, error);
    writeFileSync(filePath, content, 'utf8');
  }
}
import * as minimatch from 'minimatch'

/**
 *
 * @param sourceDirectoryPath sourceDirectoryPath must be a directory path without a filename
 * @param allowedDirectories The list of directories that are allowed to be used
 */
export function isValidDirectory(sourceDirectoryPath: string, allowedDirectories: Array<string>): boolean {
  return allowedDirectories.some((allowedDirectory) => minimatch(sourceDirectoryPath, allowedDirectory))
}

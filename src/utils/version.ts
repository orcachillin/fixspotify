// version.ts

import { execSync } from "child_process";

function getGitCommitHash(): string | null {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return null;
  }
}

interface VersionInfo {
  version: string;
  environment: string;
}

function getVersionInfo(): VersionInfo {
  const baseVersion = process.env.npm_package_version || "1.0.0";
  const environment = process.env.NODE_ENV || "development";

  // Only add git hash in development
  if (environment === "development") {
    const gitHash = getGitCommitHash();
    return {
      version: gitHash ? `${baseVersion}-${gitHash}` : baseVersion,
      environment,
    };
  }

  // Production: just use package.json version
  return {
    version: baseVersion,
    environment,
  };
}

export const versionInfo = getVersionInfo();

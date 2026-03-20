// config.ts
// Import package version (keep this as is)
import { version } from '../../package.json';

// Define the interface for global variables we'll inject
interface GlobalScope extends Window {
  API_BASE_PATH?: string;
  API_BASE_PATH_SUFFIX?: string;
  API_AUTH_TOKEN?: string;
  API_HOST_BASE?: string;
}

// Determine global scope (browser window or web worker context)
let globalScope: GlobalScope;

try {
  globalScope = window;
} catch (ex) {
  /* eslint-disable-next-line no-restricted-globals */
  globalScope = self as unknown as GlobalScope;
}

// Environment detection (you can keep this for development mode)
const isDEVModeOn: boolean = process.env.NODE_ENV === 'development';

function isJinjaPlaceholder(value: string | undefined): boolean {
  return !value || value.startsWith('{{');
}

function getBasePath(isApiBasePath: boolean = true): string {
  if (isJinjaPlaceholder(globalScope.API_BASE_PATH)) {
    return isApiBasePath ? '' : '/';
  }
  return `${globalScope.API_BASE_PATH}`;
}

// Injected by server template, fallback for local development
const API_HOST_BASE = isJinjaPlaceholder(globalScope.API_HOST_BASE)
  ? 'http://localhost:53800'
  : globalScope.API_HOST_BASE!;

// API path prefix injected by server (e.g. /api/v1), fallback for backward compat
const API_BASE_PATH_SUFFIX = isJinjaPlaceholder(
  globalScope.API_BASE_PATH_SUFFIX,
)
  ? '/api/v1'
  : globalScope.API_BASE_PATH_SUFFIX!;

let API_HOST: string = `${API_HOST_BASE}${API_BASE_PATH_SUFFIX}/rest`;

// Public API
function getAPIHost(): string {
  return API_HOST;
}

function setAPIHostBase(hostBase: string): void {
  API_HOST = `${hostBase}${API_BASE_PATH_SUFFIX}/rest`;
}

function setAPIAuthToken(authToken: string): void {
  globalScope.API_AUTH_TOKEN = authToken;
}

function getAPIAuthToken(): string {
  return globalScope.API_AUTH_TOKEN || '';
}

// Export public interface
export const MATYAN_VERSION = version;

// Cache banner configuration (keep your existing logic)
const PATHS_TO_SHOW_CACHE_BANNERS = ['notebook', 'matyan-sage'];

export function checkIsBasePathInCachedEnv(basePath: string): boolean {
  const split_paths = basePath.split('/');
  const parsed_path = split_paths[split_paths.length - 1];
  return PATHS_TO_SHOW_CACHE_BANNERS.includes(parsed_path);
}

// Export all public members
export {
  isDEVModeOn,
  getBasePath,
  getAPIHost,
  setAPIHostBase,
  setAPIAuthToken,
  getAPIAuthToken,
};

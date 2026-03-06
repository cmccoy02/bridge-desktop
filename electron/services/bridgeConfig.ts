// Single source of truth lives in bridge-mcp core.
// TODO: move bridge-mcp core into a shared package to avoid cross-project source imports.
export {
  type BridgePrimaryLanguage,
  type BridgePackageManager,
  type BridgeConfig,
  type BridgeConfigValidationResult,
  BRIDGE_CONFIG_FILE,
  DEFAULT_BRIDGE_CONFIG,
  loadBridgeConfig,
  generateDefaultConfig,
  writeBridgeConfig,
  validateConfig,
  hasBridgeConfig,
} from "../../bridge-mcp/src/core/bridgeConfig.js";

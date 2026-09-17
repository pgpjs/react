"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  PGPProvider: () => PGPProvider,
  useDecryption: () => useDecryption,
  useEncryption: () => useEncryption,
  useKey: () => useKey,
  useKeyGeneration: () => useKeyGeneration,
  usePGP: () => usePGP,
  useSign: () => useSign,
  useVerify: () => useVerify
});
module.exports = __toCommonJS(index_exports);

// src/context.tsx
var import_react = require("react");
var import_core = require("@pgpjs/core");
var import_jsx_runtime = require("react/jsx-runtime");
var PGPContext = (0, import_react.createContext)({
  config: {
    defaultSymmetricAlgorithm: import_core.SymmetricKeyAlgorithm.AES256,
    defaultHashAlgorithm: import_core.HashAlgorithm.SHA256,
    defaultCompression: import_core.CompressionAlgorithm.ZLIB
  }
});
var PGPProvider = ({ config = {}, children }) => {
  const value = (0, import_react.useMemo)(
    () => ({
      config: {
        defaultSymmetricAlgorithm: config.defaultSymmetricAlgorithm ?? import_core.SymmetricKeyAlgorithm.AES256,
        defaultHashAlgorithm: config.defaultHashAlgorithm ?? import_core.HashAlgorithm.SHA256,
        defaultCompression: config.defaultCompression ?? import_core.CompressionAlgorithm.ZLIB
      }
    }),
    [config.defaultSymmetricAlgorithm, config.defaultHashAlgorithm, config.defaultCompression]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PGPContext.Provider, { value, children });
};
function usePGP() {
  return (0, import_react.useContext)(PGPContext);
}

// src/hooks.ts
var import_react2 = require("react");
var import_core2 = require("@pgpjs/core");
function useKey(options = {}) {
  const [key, setKey] = (0, import_react2.useState)(null);
  const [loading, setLoading] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  const loadKey = (0, import_react2.useCallback)(async () => {
    if (!options.armoredKey && !options.binaryKey) {
      setKey(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const parsed = await (0, import_core2.readKey)({
        armoredKey: options.armoredKey,
        binaryKey: options.binaryKey
      });
      setKey(parsed);
    } catch (err) {
      setError(err);
      setKey(null);
    } finally {
      setLoading(false);
    }
  }, [options.armoredKey, options.binaryKey]);
  (0, import_react2.useEffect)(() => {
    loadKey();
  }, [loadKey]);
  return { key, loading, error, reload: loadKey };
}
function useKeyGeneration() {
  const [isGenerating, setIsGenerating] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  const [result, setResult] = (0, import_react2.useState)(null);
  const generate = (0, import_react2.useCallback)(async (options) => {
    setIsGenerating(true);
    setError(null);
    try {
      const kp = await (0, import_core2.generateKeyPair)(options);
      setResult(kp);
      return kp;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);
  return { generate, isGenerating, error, result };
}
function useEncryption() {
  const { config } = usePGP();
  const [isEncrypting, setIsEncrypting] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  const [result, setResult] = (0, import_react2.useState)(null);
  const executeEncrypt = (0, import_react2.useCallback)(
    async (options) => {
      setIsEncrypting(true);
      setError(null);
      try {
        const out = await (0, import_core2.encrypt)({
          symmetricAlgorithm: config.defaultSymmetricAlgorithm,
          compression: config.defaultCompression,
          ...options
        });
        setResult(out);
        return out;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [config]
  );
  return { encrypt: executeEncrypt, isEncrypting, error, result };
}
function useDecryption() {
  const [isDecrypting, setIsDecrypting] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  const [result, setResult] = (0, import_react2.useState)(null);
  const executeDecrypt = (0, import_react2.useCallback)(async (options) => {
    setIsDecrypting(true);
    setError(null);
    try {
      const out = await (0, import_core2.decrypt)(options);
      setResult(out);
      return out;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsDecrypting(false);
    }
  }, []);
  return { decrypt: executeDecrypt, isDecrypting, error, result };
}
function useSign() {
  const { config } = usePGP();
  const [isSigning, setIsSigning] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  const [result, setResult] = (0, import_react2.useState)(null);
  const executeSign = (0, import_react2.useCallback)(
    async (options) => {
      setIsSigning(true);
      setError(null);
      try {
        const out = await (0, import_core2.sign)({
          hashAlgorithm: config.defaultHashAlgorithm,
          ...options
        });
        setResult(out);
        return out;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setIsSigning(false);
      }
    },
    [config]
  );
  return { sign: executeSign, isSigning, error, result };
}
function useVerify() {
  const [isVerifying, setIsVerifying] = (0, import_react2.useState)(false);
  const [error, setError] = (0, import_react2.useState)(null);
  const [result, setResult] = (0, import_react2.useState)(null);
  const executeVerify = (0, import_react2.useCallback)(async (options) => {
    setIsVerifying(true);
    setError(null);
    try {
      const out = await (0, import_core2.verify)(options);
      setResult(out);
      return out;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsVerifying(false);
    }
  }, []);
  return { verify: executeVerify, isVerifying, error, result };
}

// src/index.ts
__reExport(index_exports, require("@pgpjs/core"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PGPProvider,
  useDecryption,
  useEncryption,
  useKey,
  useKeyGeneration,
  usePGP,
  useSign,
  useVerify,
  ...require("@pgpjs/core")
});

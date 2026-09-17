// src/context.tsx
import { createContext, useContext, useMemo } from "react";
import { SymmetricKeyAlgorithm, HashAlgorithm, CompressionAlgorithm } from "@pgpjs/core";
import { jsx } from "react/jsx-runtime";
var PGPContext = createContext({
  config: {
    defaultSymmetricAlgorithm: SymmetricKeyAlgorithm.AES256,
    defaultHashAlgorithm: HashAlgorithm.SHA256,
    defaultCompression: CompressionAlgorithm.ZLIB
  }
});
var PGPProvider = ({ config = {}, children }) => {
  const value = useMemo(
    () => ({
      config: {
        defaultSymmetricAlgorithm: config.defaultSymmetricAlgorithm ?? SymmetricKeyAlgorithm.AES256,
        defaultHashAlgorithm: config.defaultHashAlgorithm ?? HashAlgorithm.SHA256,
        defaultCompression: config.defaultCompression ?? CompressionAlgorithm.ZLIB
      }
    }),
    [config.defaultSymmetricAlgorithm, config.defaultHashAlgorithm, config.defaultCompression]
  );
  return /* @__PURE__ */ jsx(PGPContext.Provider, { value, children });
};
function usePGP() {
  return useContext(PGPContext);
}

// src/hooks.ts
import { useState, useEffect, useCallback } from "react";
import {
  generateKeyPair,
  readKey,
  encrypt,
  decrypt,
  sign,
  verify
} from "@pgpjs/core";
function useKey(options = {}) {
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadKey = useCallback(async () => {
    if (!options.armoredKey && !options.binaryKey) {
      setKey(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const parsed = await readKey({
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
  useEffect(() => {
    loadKey();
  }, [loadKey]);
  return { key, loading, error, reload: loadKey };
}
function useKeyGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const generate = useCallback(async (options) => {
    setIsGenerating(true);
    setError(null);
    try {
      const kp = await generateKeyPair(options);
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
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const executeEncrypt = useCallback(
    async (options) => {
      setIsEncrypting(true);
      setError(null);
      try {
        const out = await encrypt({
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
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const executeDecrypt = useCallback(async (options) => {
    setIsDecrypting(true);
    setError(null);
    try {
      const out = await decrypt(options);
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
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const executeSign = useCallback(
    async (options) => {
      setIsSigning(true);
      setError(null);
      try {
        const out = await sign({
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const executeVerify = useCallback(async (options) => {
    setIsVerifying(true);
    setError(null);
    try {
      const out = await verify(options);
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
export * from "@pgpjs/core";
export {
  PGPProvider,
  useDecryption,
  useEncryption,
  useKey,
  useKeyGeneration,
  usePGP,
  useSign,
  useVerify
};

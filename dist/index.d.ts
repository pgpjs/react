import React, { ReactNode } from 'react';
import { SymmetricKeyAlgorithm, HashAlgorithm, CompressionAlgorithm, DecryptOptions, DecryptResult, EncryptOptions, Key, GenerateKeyPairOptions, KeyPairResult, SignOptions, VerifyOptions, VerifyResult } from '@pgpjs/core';
export * from '@pgpjs/core';

interface PGPConfig {
    defaultSymmetricAlgorithm?: SymmetricKeyAlgorithm;
    defaultHashAlgorithm?: HashAlgorithm;
    defaultCompression?: CompressionAlgorithm;
}
interface PGPContextValue {
    config: PGPConfig;
}
interface PGPProviderProps {
    config?: PGPConfig;
    children: ReactNode;
}
declare const PGPProvider: React.FC<PGPProviderProps>;
declare function usePGP(): PGPContextValue;

declare function useKey(options?: {
    armoredKey?: string;
    binaryKey?: Uint8Array;
}): {
    key: Key | null;
    loading: boolean;
    error: Error | null;
    reload: () => Promise<void>;
};
declare function useKeyGeneration(): {
    generate: (options: GenerateKeyPairOptions) => Promise<KeyPairResult>;
    isGenerating: boolean;
    error: Error | null;
    result: KeyPairResult | null;
};
declare function useEncryption(): {
    encrypt: (options: EncryptOptions) => Promise<string | Uint8Array>;
    isEncrypting: boolean;
    error: Error | null;
    result: string | Uint8Array<ArrayBufferLike> | null;
};
declare function useDecryption(): {
    decrypt: (options: DecryptOptions) => Promise<DecryptResult>;
    isDecrypting: boolean;
    error: Error | null;
    result: DecryptResult | null;
};
declare function useSign(): {
    sign: (options: SignOptions) => Promise<string | Uint8Array>;
    isSigning: boolean;
    error: Error | null;
    result: string | Uint8Array<ArrayBufferLike> | null;
};
declare function useVerify(): {
    verify: (options: VerifyOptions) => Promise<VerifyResult>;
    isVerifying: boolean;
    error: Error | null;
    result: VerifyResult | null;
};

export { type PGPConfig, type PGPContextValue, PGPProvider, type PGPProviderProps, useDecryption, useEncryption, useKey, useKeyGeneration, usePGP, useSign, useVerify };

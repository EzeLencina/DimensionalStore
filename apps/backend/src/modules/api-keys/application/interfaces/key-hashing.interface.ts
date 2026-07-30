export interface IKeyHashingService {
  hash(plainKey: string): Promise<string>;
  verify(hash: string, plainKey: string): Promise<boolean>;
}

export interface IKeyGeneratorService {
  generateKey(prefix: string): { plainKey: string; keyHash: string; keyPrefix: string; keyLastChars: string };
}

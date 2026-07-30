import { TokenType, TokenPayload, TokenPair } from '../../domain/types';

export interface ITokenService {
  generateAccessToken(payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>): Promise<string>;
  generateRefreshToken(payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>): Promise<string>;
  generateTokenPair(payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>): Promise<TokenPair>;
  verifyToken(token: string, type: TokenType): Promise<TokenPayload>;
  decodeToken(token: string): TokenPayload | null;
}

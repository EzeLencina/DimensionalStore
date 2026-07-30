import { SessionInfo } from '../../domain/types';

export interface ISessionRepository {
  save(session: SessionInfo): Promise<void>;
  findById(sessionId: string): Promise<SessionInfo | null>;
  findByUserId(userId: string): Promise<SessionInfo[]>;
  delete(sessionId: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}

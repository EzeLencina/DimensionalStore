import { Injectable } from '@nestjs/common';
import { ISessionRepository } from '../../application/interfaces';
import { SessionInfo } from '../../domain/types';

@Injectable()
export class InMemorySessionRepository implements ISessionRepository {
  private readonly sessions: Map<string, SessionInfo> = new Map();

  async save(session: SessionInfo): Promise<void> {
    this.sessions.set(session.sessionId, session);
  }

  async findById(sessionId: string): Promise<SessionInfo | null> {
    return this.sessions.get(sessionId) ?? null;
  }

  async findByUserId(userId: string): Promise<SessionInfo[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId,
    );
  }

  async delete(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const userSessions = await this.findByUserId(userId);
    for (const session of userSessions) {
      this.sessions.delete(session.sessionId);
    }
  }
}

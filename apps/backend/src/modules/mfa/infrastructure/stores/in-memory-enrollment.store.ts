import { Injectable } from '@nestjs/common';
import { MfaEnrollment, MfaMethod } from '../../domain/types';

@Injectable()
export class InMemoryEnrollmentStore {
  private enrollments = new Map<string, MfaEnrollment>();

  async save(enrollment: MfaEnrollment): Promise<void> {
    this.enrollments.set(`${enrollment.userId}_${enrollment.method}`, { ...enrollment });
  }

  async findByUserId(userId: string): Promise<MfaEnrollment[]> {
    return Array.from(this.enrollments.values())
      .filter(e => e.userId === userId)
      .map(e => ({ ...e }));
  }

  async findByUserIdAndMethod(userId: string, method: MfaMethod): Promise<MfaEnrollment | null> {
    const found = this.enrollments.get(`${userId}_${method}`);
    return found ? { ...found } : null;
  }

  async update(enrollment: MfaEnrollment): Promise<void> {
    this.enrollments.set(`${enrollment.userId}_${enrollment.method}`, { ...enrollment });
  }

  async deleteByUserIdAndMethod(userId: string, method: MfaMethod): Promise<void> {
    this.enrollments.delete(`${userId}_${method}`);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    for (const [key, e] of this.enrollments) {
      if (e.userId === userId) {
        this.enrollments.delete(key);
      }
    }
  }
}

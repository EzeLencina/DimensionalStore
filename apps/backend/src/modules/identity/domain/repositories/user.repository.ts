import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { UserId, Email, Username } from '../value-objects';
import { UserMembership } from '../types';

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: Username): Promise<User | null>;
  findAll(options?: { offset?: number; limit?: number; status?: string }): Promise<User[]>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
  count(): Promise<number>;
}

export interface IProfileRepository {
  findByUserId(userId: UserId): Promise<Profile | null>;
  save(profile: Profile): Promise<void>;
  update(profile: Profile): Promise<void>;
}

export interface IUserMembershipRepository {
  findByUserId(userId: UserId): Promise<UserMembership[]>;
  save(membership: UserMembership): Promise<void>;
  delete(userId: UserId, organizationId: string): Promise<void>;
}

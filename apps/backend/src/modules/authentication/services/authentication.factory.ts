import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IAuthenticationService } from '../application/interfaces';

export interface AuthenticationProvider {
  name: string;
  service: IAuthenticationService;
}

@Injectable()
export class AuthenticationFactory {
  private readonly providers: Map<string, AuthenticationProvider> = new Map();

  constructor(
    @Inject('IAuthenticationService')
    private readonly defaultAuthService: IAuthenticationService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {
    this.register({ name: 'local', service: defaultAuthService });
  }

  register(provider: AuthenticationProvider): void {
    this.providers.set(provider.name, provider);
    this.logger.info(
      { event: 'auth.factory.register', provider: provider.name },
      'Authentication provider registered',
    );
  }

  getProvider(name: string): IAuthenticationService {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Authentication provider '${name}' not registered`);
    }
    return provider.service;
  }

  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

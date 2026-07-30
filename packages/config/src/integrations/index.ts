export interface IntegrationConfig {
  readonly stripeKey?: string;
  readonly mercadopagoKey?: string;
  readonly sendgridKey?: string;
}

export function integrationsConfig(): IntegrationConfig {
  return {};
}

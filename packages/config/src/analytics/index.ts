export interface AnalyticsConfig {
  readonly enabled: boolean;
  readonly provider?: string;
}

export function analyticsConfig(): AnalyticsConfig {
  return {
    enabled: false,
  };
}

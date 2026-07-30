export interface RequestTiming {
  dns: number;
  connect: number;
  tls: number;
  firstByte: number;
  total: number;
}

export interface TimingEvent {
  name: string;
  timestamp: number;
  duration: number;
}

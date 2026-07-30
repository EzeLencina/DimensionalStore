import 'reflect-metadata';

const JOB_METADATA_KEY = 'queue:job:metadata';

export interface JobMetadata {
  name: string;
  queueName: string;
  concurrency?: number;
  attempts?: number;
  timeout?: number;
}

export function JobDefinition(metadata: JobMetadata): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(JOB_METADATA_KEY, metadata, target);
  };
}

export function getJobMetadata(target: object): JobMetadata | undefined {
  return Reflect.getMetadata(JOB_METADATA_KEY, target);
}

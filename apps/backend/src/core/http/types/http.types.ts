export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type HttpDriverType = 'undici' | 'axios' | 'got';

export type HttpResponseType = 'json' | 'text' | 'buffer' | 'stream';

export type RequestPriority = 'high' | 'normal' | 'low';

export type HttpProtocol = 'http:' | 'https:';

export type HttpVersion = '1.1' | '2.0' | '3.0';

export type TlsVersion = 'TLSv1.2' | 'TLSv1.3';

import { describe, expect, it } from 'vitest';
import { handler } from './handler';

function event(method: string, path: string) {
  return {
    rawPath: path,
    requestContext: { http: { method, path } },
  } as never;
}

describe('api handler', () => {
  it('answers the health check', async () => {
    const res = await handler(event('GET', '/demo/health'));
    expect(res).toMatchObject({ statusCode: 200 });
  });

  it('404s unknown routes', async () => {
    const res = await handler(event('GET', '/demo/nope'));
    expect(res).toMatchObject({ statusCode: 404 });
  });
});

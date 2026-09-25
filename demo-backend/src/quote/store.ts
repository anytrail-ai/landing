import { randomUUID } from 'node:crypto';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { TABLE_NAME, docClient, keys, ttlSeconds } from '../db';
import type { Catalog, CatalogBody, PriceRequest, Quote } from './types';

async function get<T>(key: { pk: string; sk: string }): Promise<T | null> {
  const res = await docClient().send(new GetCommand({ TableName: TABLE_NAME, Key: key }));
  return (res.Item as T | undefined) ?? null;
}

async function put(key: { pk: string; sk: string }, item: object): Promise<void> {
  await docClient().send(
    new PutCommand({ TableName: TABLE_NAME, Item: { ...key, ...item, expiresAt: ttlSeconds() } }),
  );
}

export async function saveCatalog(body: CatalogBody): Promise<Catalog> {
  const catalog: Catalog = { catalogId: randomUUID(), ...body };
  await putCatalog(catalog);
  return catalog;
}

export const putCatalog = (c: Catalog) => put(keys.quoteCatalog(c.catalogId), c);
export const getCatalog = (id: string) => get<Catalog>(keys.quoteCatalog(id));

export async function createSession(catalogId: string): Promise<string> {
  const id = randomUUID();
  await put(keys.quoteSession(id), { catalogId });
  return id;
}
export const getSession = (id: string) => get<{ catalogId: string }>(keys.quoteSession(id));

export const putQuote = (q: Quote) => put(keys.quote(q.quoteId), q);
export const getQuote = (id: string) => get<Quote>(keys.quote(id));

export const putPriceRequest = (r: PriceRequest) => put(keys.priceRequest(r.token), r);
export const getPriceRequest = (token: string) => get<PriceRequest>(keys.priceRequest(token));

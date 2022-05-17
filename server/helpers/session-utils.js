//import type {SessionInterface} from './types';
import { Shopify, ApiVersion } from "@shopify/shopify-api";

/**
 * Like Object.fromEntries(), but normalizes the keys and filters out null values.
 */
export function sessionFromEntries(entries) {
  const processedEntries = entries.filter(([_key, value]) => value !== null)
  .map(([key, value]) => {
    switch (key.toLowerCase()) {
      case 'isonline':
        if (typeof value === 'string') {
          value = value.toString().toLowerCase() === 'true';
        } else if (typeof value === 'number') {
          value = Boolean(value);
        }
        return ['isOnline', value];
      case 'accesstoken':
        return ['accessToken', value];
      case 'scope':
        return ['scope', value.toString()];  
      default:
        return [key.toLowerCase(), value];
    }
  });

  const obj = Object.fromEntries(processedEntries);

  const newSession = new Shopify.Session.Session(
    obj.id,
    obj.shop,
    obj.state,
    obj.isOnline,
  );

  newSession.scope = obj.scope;
  newSession.expires = obj.expires;
  newSession.accessToken = obj.accessToken;
  newSession.onlineAccessInfo = obj.onlineAccessInfo;

  return newSession;
}

const includedKeys = [
  'id',
  'shop',
  'state',
  'isOnline',
  'scope',
  'accessToken',
];
export function sessionEntries(session) {
  return Object.entries(session).filter(([key]) => includedKeys.includes(key));
}
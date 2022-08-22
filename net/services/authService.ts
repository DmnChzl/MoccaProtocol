import { checkJwtByKey, genKey, getJwtByKey } from '../jwtUtils.ts';
import { getUniversallyUniqueIdentifier } from '../utils.ts';

const key = await genKey(getUniversallyUniqueIdentifier());

export const getJwt = (data: any) => getJwtByKey(key, data);
export const checkJwt = (jwt: string) => checkJwtByKey(key, jwt);

/**
 * @method checkAuth
 * @param {Headers} headers
 * @throws {Error}
 */
async function checkAuth(headers: Headers) {
  const authorization = headers.get('authorization');

  if (authorization && /^Bearer/.test(authorization)) {
    const jwt = authorization.replace(/^Bearer\s/, '');
    const { exp } = await checkJwt(jwt);

    if (exp < Date.now()) {
      throw new Error('Expired Token');
    }

    return;
  }

  throw new Error('No Auth');
}

export { checkAuth };

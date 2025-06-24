import axios from 'axios';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';

import { envServer } from '@/base/config/env-server.config';

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleFetch(path, req);
}

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleFetch(path, req);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleFetch(path, req);
}

export async function PUT(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleFetch(path, req);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleFetch(path, req);
}

async function handleFetch(path: string[], req: Request) {
  const fetchUrl =
    `${envServer.API_URL!}${path.join('/')}` +
    (!req.url.includes('?') ? '' : req.url.substring(req.url.indexOf('?')));
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value;
  let refreshToken = cookieStore.get('refreshToken')?.value;
  let user = cookieStore.get('user')?.value;
  let setNewTokens = false;
  let deleteAllTokens = false;

  if (req.headers.get('Is-Private-Route') === 'true') {
    try {
      const { exp } = decodeJwt(accessToken ?? '');
      if (exp! * 1000 < Date.now()) throw new Error();

      req.headers.set('Authorization', `Bearer ${accessToken}`);
    } catch (_accessTokenError) {
      try {
        const {
          data: { data: payload },
        } = await axios.post(
          '/auth/refresh-token',
          {
            refreshToken,
          },
          { baseURL: envServer.API_URL },
        );

        accessToken = payload.accessToken;
        refreshToken = payload.refreshToken;
        user = JSON.stringify({
          ...payload.user,
          displayName: encodeURIComponent(payload.user.displayName),
        });
        req.headers.set('Authorization', `Bearer ${accessToken}`);
        setNewTokens = true;
      } catch (_refreshTokenError) {
        deleteAllTokens = true;
      }
    }
  }

  const res = await fetch(fetchUrl, {
    method: req.method,
    headers: req.headers,
    ...(req.method !== 'GET' && { body: req.body, duplex: 'half' }),
  });
  const isUpdateUser = req.method === 'PATCH' && fetchUrl.endsWith('/users/profile') && res.ok;

  // If this fetch is updating user profile, update the cookie as well
  if (isUpdateUser) {
    if (!setNewTokens) {
      return new Response(res.body, {
        headers: {
          ...Object.fromEntries(Array.from(res.headers.entries())),
          'Set-Cookie': 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        },
      });
    }
  }

  if (setNewTokens) {
    return new Response(res.body, {
      // @ts-expect-error Array of cookies does work in runtime
      headers: {
        ...Object.fromEntries(Array.from(res.headers.entries())),
        'Set-Cookie': [
          `accessToken=${accessToken}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
          `refreshToken=${refreshToken}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
          `user=${user}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
        ],
      },
      status: res.status,
      statusText: res.statusText,
    });
  }

  if (deleteAllTokens) {
    return new Response(res.body, {
      // @ts-expect-error Array of cookies does work in runtime
      headers: {
        ...Object.fromEntries(Array.from(res.headers.entries())),
        'Set-Cookie': [
          `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        ],
      },
      status: res.status,
      statusText: res.statusText,
    });
  }

  return res;
}

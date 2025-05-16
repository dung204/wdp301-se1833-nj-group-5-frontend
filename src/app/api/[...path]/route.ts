import axios from 'axios';
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';
import url from 'url';

import { env } from '@/base/config';

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
  const fetchUrl = url.resolve(env.API_URL, path.join('/'));
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
        } = await axios.post(url.resolve(env.API_URL, '/auth/refresh-token'), {
          refreshToken,
        });

        accessToken = payload.accessToken;
        refreshToken = payload.refreshToken;
        user = JSON.stringify(payload.user);
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
    ...(req.method !== 'GET' && { body: JSON.stringify(await req.json()) }),
  });

  if (setNewTokens) {
    res.headers.append(
      'Set-Cookie',
      `accessToken=${accessToken}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
    );
    res.headers.append(
      'Set-Cookie',
      `refreshToken=${refreshToken}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
    );
    res.headers.append(
      'Set-Cookie',
      `user=${user}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
    );
  }

  if (deleteAllTokens) {
    res.headers.append('Set-Cookie', `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    res.headers.append(
      'Set-Cookie',
      `refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    );
    res.headers.append('Set-Cookie', `user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  }

  return res;
}

import { decodeJwt } from 'jose';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';

import { env } from '@/base/config';
import { LoginSuccessResponse, RefreshTokenSuccessResponse } from '@/modules/auth/types';

export const config = {
  /**
   * The middleware runs on all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, sitemap.xml, robots.txt (metadata files)
   * - URL with file extension (names & extensions are separated by a dot)
   */
  matcher: '/((?!api|_next/static|_next/image|.*\\..*).*)',
};

const privateRoutes = ['/private'];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;
  const redirectUrl = request.nextUrl.clone();
  const isAuthRoute = pathname.startsWith('/auth');
  const isPrivateRoute = privateRoutes.some((route) => pathToRegexp(route).regexp.test(pathname));

  try {
    const { exp } = decodeJwt(accessToken ?? '');
    if (exp! * 1000 < Date.now()) throw new Error();

    // When access token is valid, users can not access to auth routes
    if (isAuthRoute) {
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }

    // Continue if the route is public
    return NextResponse.next();
  } catch (_accessTokenError) {
    try {
      const payload = await handleRefreshToken(refreshToken ?? '');

      // After success token refresh, users stay logged in and can not access to auth routes
      if (isAuthRoute) {
        redirectUrl.pathname = '/';
        return setCookieAndRedirect(redirectUrl, payload);
      }

      // For private & public routes, continue after success token refresh
      return setCookieAndRedirect(request.nextUrl, payload);
    } catch (_refreshTokenError) {
      // When refresh token is invalid, delete cookies & redirect to login page if the route is private
      if (isPrivateRoute) {
        redirectUrl.pathname = '/auth/login';
        return deleteCookieAndRedirect(redirectUrl);
      }

      // For auth & public routes, continue if refresh token is invalid
      return NextResponse.next({
        // @ts-expect-error Array of cookies does work in runtime
        headers: {
          'Set-Cookie': [
            `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            `refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            `user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          ],
        },
      });
    }
  }
}

async function handleRefreshToken(refreshToken: string) {
  // Should not use authService, since that service is for client side
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error();

  return res.json() as Promise<RefreshTokenSuccessResponse>;
}

function setCookieAndRedirect(url: NextURL, payload: LoginSuccessResponse) {
  const { accessToken, refreshToken, user } = payload.data;

  return NextResponse.redirect(url, {
    // @ts-expect-error Array of cookies does work in runtime
    headers: {
      'Set-Cookie': [
        `accessToken=${accessToken}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
        `refreshToken=${refreshToken}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
        `user=${JSON.stringify(user)}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      ],
    },
  });
}

function deleteCookieAndRedirect(url: NextURL) {
  return NextResponse.redirect(url, {
    // @ts-expect-error Array of cookies does work in runtime
    headers: {
      'Set-Cookie': [
        `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        `refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        `user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      ],
    },
  });
}

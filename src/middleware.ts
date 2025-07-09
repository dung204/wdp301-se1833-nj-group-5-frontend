import { decodeJwt } from 'jose';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';

import { LoginSuccessResponse, RefreshTokenSuccessResponse, Role } from '@/modules/auth/types';

import { envServer } from './base/config/env-server.config';
import { RouteUtils } from './base/utils';
import { userSchema } from './modules/users/types';

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

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;
  const redirectUrl = request.nextUrl.clone();
  const isAuthRoute = RouteUtils.isAuthRoute(pathname);
  const isPrivateRoute = RouteUtils.isPrivateRoute(pathname);
  const isManagerRoute = RouteUtils.isManagerRoute(pathname);

  try {
    if (!accessToken && !isPrivateRoute && !isManagerRoute) {
      return NextResponse.next();
    }

    const { exp } = decodeJwt(accessToken ?? '');
    const user = userSchema
      .pick({ id: true, role: true, fullName: true, gender: true })
      .safeParse(JSON.parse(request.cookies.get('user')?.value ?? '{}')).data;

    // If access token is expired or the user (retrieved from cookies) is not available -> refresh the access token
    if (exp! * 1000 < Date.now() || !user) throw new Error();

    if (isAuthRoute || (isManagerRoute && ![Role.ADMIN, Role.HOTEL_OWNER].includes(user.role))) {
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }

    // Continue if the route is public
    return NextResponse.next();
  } catch (_accessTokenError) {
    try {
      const payload = await handleRefreshToken(refreshToken ?? '');
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: newUser,
      } = payload.data;

      if (
        isAuthRoute ||
        (isManagerRoute && ![Role.ADMIN, Role.HOTEL_OWNER].includes(newUser.role))
      ) {
        redirectUrl.pathname = '/';
        return setCookieAndRedirect(redirectUrl, payload);
      }

      // For private & public routes, continue after success token refresh
      return NextResponse.next({
        // @ts-expect-error Array of cookies does work in runtime
        headers: {
          'Set-Cookie': [
            `accessToken=${newAccessToken}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
            `refreshToken=${newRefreshToken}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
            `user=${JSON.stringify({ ...newUser, ...(newUser.fullName && { fullName: encodeURIComponent(newUser.fullName) }) })}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
          ],
        },
      });
    } catch (_refreshTokenError) {
      // When refresh token is invalid, delete cookies & redirect to login page if the route is private
      if (isPrivateRoute || isManagerRoute) {
        redirectUrl.pathname = '/';
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
  const res = await fetch(`${envServer.API_URL}auth/refresh`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

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
        `user=${JSON.stringify({ ...user, ...(user.fullName && { fullName: encodeURIComponent(user.fullName) }) })}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
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

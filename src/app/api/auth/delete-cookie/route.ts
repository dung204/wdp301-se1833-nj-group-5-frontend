export async function DELETE(_: Request) {
  return new Response(null, {
    status: 204,
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

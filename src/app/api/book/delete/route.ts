export async function DELETE(_: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Set-Cookie': 'booking=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    },
  });
}

export async function POST(request: Request) {
  const userData = await request.json();

  if (!userData) {
    return Response.json({ message: 'User data not provided.' }, { status: 400 });
  }

  return Response.json(
    { message: 'User cookie updated successfully' },
    {
      status: 200,
      headers: {
        'Set-Cookie': `user=${JSON.stringify(userData)}; Path=/; Secure; Max-Age=31536000; HttpOnly; SameSite=Lax`,
      },
    },
  );
}

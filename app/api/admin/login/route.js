export async function POST(req) {
  const { email, password } = await req.json();

  // Temporary hardcoded check
  if (email === 'admin@regreen.com' && password === 'admin123') {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }
}

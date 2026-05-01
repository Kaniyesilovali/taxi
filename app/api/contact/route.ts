import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const apiKey = process.env.SENDGRID_API_KEY
    const toEmail = process.env.CONTACT_EMAIL ?? 'info@taxsi.cy'

    if (!apiKey) {
      console.error('SENDGRID_API_KEY not set')
      return NextResponse.json({ error: 'Mail not configured' }, { status: 500 })
    }

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: toEmail }] }],
        from: { email: toEmail, name: 'Taxsi Contact Form' },
        reply_to: { email, name },
        subject: `Contact form: ${name}`,
        content: [{ type: 'text/plain', value: `From: ${name} <${email}>\n\n${message}` }],
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Mail failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

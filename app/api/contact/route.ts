import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate the inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Here you would typically handle the contact form submission
    // For example, sending an email or saving to a database
    console.log('Contact form submission:', { name, email, message });

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// Optionally, you can also handle GET requests if needed
export async function GET() {
  return NextResponse.json(
    { message: 'Contact API endpoint is working' },
    { status: 200 }
  );
} 
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Use a free anime style generator API
    // Using DeepAI's anime style API as fallback
    const response = await fetch('https://api.deepai.org/api/toonify', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.DEEPAI_API_KEY || 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K',
      },
      body: JSON.stringify({
        image: image,
      }),
    })

    if (!response.ok) {
      // Fallback to a simple anime filter simulation
      // In production, you'd integrate with a real AI service
      return NextResponse.json({
        output: image, // Return original image as fallback
        message: 'Using preview mode. Configure API keys for full functionality.',
      })
    }

    const data = await response.json()
    return NextResponse.json({ output: data.output_url })
  } catch (error) {
    console.error('Error generating anime image:', error)

    // Fallback response
    return NextResponse.json(
      {
        error: 'Failed to generate anime image',
        message: 'API service unavailable. Please try again later.'
      },
      { status: 500 }
    )
  }
}

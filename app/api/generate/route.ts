import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, aspectRatio } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.POLLINATIONS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Pollinations API key is not configured" },
        { status: 500 }
      );
    }

    const finalPrompt = `${prompt.trim()}, ${style} style`;

const encodedPrompt = encodeURIComponent(finalPrompt);

const sizeMap: Record<string, string> = {
  "1:1": "1024x1024",
  "16:9": "1344x768",
  "4:3": "1152x864",
  "9:16": "768x1344",
};

const size = sizeMap[aspectRatio] || "1024x1024";

const imageUrl =
  `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=${size.split("x")[0]}&height=${size.split("x")[1]}`;

    console.log("Calling Pollinations...");

    const response = await fetch(imageUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    console.log("Pollinations status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Pollinations error:", errorText);

      return NextResponse.json(
        {
          error: "Pollinations rejected the request",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Generation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { codeToHtml } from "shiki";

export async function POST(request: NextRequest) {
  const { code, lang } = await request.json();

  try {
    const html = await codeToHtml(code, {
      lang: lang || "text",
      theme: "github-dark",
    });
    return NextResponse.json({ html });
  } catch {
    // Fallback if language isn't supported
    const html = await codeToHtml(code, {
      lang: "text",
      theme: "github-dark",
    });
    return NextResponse.json({ html });
  }
}

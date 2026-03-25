type Provider = 'openai' | 'groq' | 'gemini';

type HelloOutput = {
  ok: true;
  provider: Provider;
  model: string;
  message: string;
};

type GeminiGenerateContent = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

async function helloGemini(): Promise<HelloOutput> {
  const apikey = process.env.GOOGLE_API_KEY;


  if (!apikey) throw new Error("Google API key is not present");

  const model = 'models/gemini-2.0-flash-lite';


  const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apikey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: 'Say a short hello',
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini ${response.status}: ${await response.text()}`);
  }

  const json = (await response.json()) as GeminiGenerateContent;


  const text =
    json.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Hello as default';

  return {
    ok: true,
    provider: 'gemini',
    model,
    message: String(text).trim(),
  };
}

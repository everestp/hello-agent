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
          parts: [{ text: 'Say a short hello' }],
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

// ✅ FIXED TYPE
type OpenAiChatCompletion = {
  choices?: Array<{ message?: { content?: string } }>;
};

async function helloGroq(): Promise<HelloOutput> {
  const apikey = process.env.GROQ_API_KEY;

  if (!apikey) throw new Error("Groq API key is not present");

  const model = 'llama-3.1-8b-instant';

  const url = `https://api.groq.com/openai/v1/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apikey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: 'Say a short hello',
        },
      ],
      temperature: 0,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq ${response.status}: ${await response.text()}`);
  }

  const json = (await response.json()) as OpenAiChatCompletion;

  const content =
    json?.choices?.[0]?.message?.content ?? 'Hello as default';

  return {
    ok: true,
    provider: 'groq',
    model,
    message: String(content).trim(),
  };
}

async function helloOpenAI(): Promise<HelloOutput> {
  const apikey = process.env.OPENAI_API_KEY;

  if (!apikey) throw new Error("OpenAI API key is not present");

  const model = 'gpt-4o-mini';

  const url = `https://api.openai.com/v1/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apikey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: 'Say a short hello',
        },
      ],
      temperature: 0,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI ${response.status}: ${await response.text()}`);
  }

  const json = (await response.json()) as OpenAiChatCompletion;

  const content =
    json?.choices?.[0]?.message?.content ?? 'Hello as default';

  return {
    ok: true,
    provider: 'openai',
    model,
    message: String(content).trim(),
  };
}

export async function selectAndHello(): Promise<HelloOutput> {
  const forced = (process.env.PROVIDER || '').toLowerCase();

  // ✅ FIXED ROUTING
  if (forced === 'gemini') return helloGemini();
  if (forced === 'openai') return helloOpenAI();
  if (forced === 'groq') return helloGroq();

  if (forced) {
    throw new Error(
      `Unsupported PROVIDER=${forced}. Use openai | gemini | groq`
    );
  }


  if (process.env.GOOGLE_API_KEY) {
    try {
      return await helloGemini();
    } catch {}
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      return await helloOpenAI();
    } catch {}
  }

  if (process.env.GROQ_API_KEY) {
    try {
      return await helloGroq();
    } catch {}
  }

  throw new Error("No provider configured");
}

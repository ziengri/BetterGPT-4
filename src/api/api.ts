import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface } from '@type/chat';

// Environment variables - remember to define in Vercel
const endpoint = import.meta.env.VITE_OPENAI_BASE_URL;
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const getChatCompletion = async (
  messages: MessageInterface[],
  config: ConfigInterface,
  customHeaders?: Record<string, string>
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: JSON.stringify({
      messages,
      ...config,
      model: config.model,
      allow_fallback: true,
      max_tokens: undefined,
    }),
    mode: 'cors',
  });
  // Error handling (catch-all)
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();
  return data;
};

export const getChatCompletionStream = async (
  messages: MessageInterface[],
  config: ConfigInterface,
  customHeaders?: Record<string, string>
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      ...config,
      max_tokens: undefined,
      allow_fallback: true,
      stream: true,
    }),
    mode: 'cors',
  });

  /* Handling different response statuses from the API request. */
  if ((await response.status) === 429) {
    // Showing rate limit message
    const responseText = await response.text();
    throw new Error(JSON.parse(responseText).detail);
  } else if (response.status === 500) {
    // Internal server error
    throw new Error(
      'Internal server error. Something went wrong on our side. Check back later and try again.'
    );
  } else if (!response.ok) {
    // All other errors
    throw new Error(
      'Status Code: ' +
        (await response.status) +
        '\nError Message: ' +
        (await response.text())
    );
  }

  const stream = response.body;
  return stream;
};

export const submitShareGPT = async (body: ShareGPTSubmitBodyInterface) => {
  const request = await fetch('https://sharegpt.com/api/conversations', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const response = await request.json();
  const { id } = response;
  const url = `https://shareg.pt/${id}`;
  window.open(url, '_blank');
};

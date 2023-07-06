import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface } from '@type/chat';

const endpoint = import.meta.env.VITE_OPENAI_BASE_URL;
const apiKey1 = import.meta.env.VITE_OPENAI_API_KEY_1;
const apiKey2 = import.meta.env.VITE_OPENAI_API_KEY_2;

export const getChatCompletion = async (
  messages: MessageInterface[],
  config: ConfigInterface,
  customHeaders?: Record<string, string>
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (apiKey1) headers.Authorization = `Bearer ${apiKey1}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: JSON.stringify({
      messages,
      ...config,
      model: config.model,
      max_tokens: undefined,
    }),
  });
  if (response.status === 429) {
    if (apiKey2) headers.Authorization = `Bearer ${apiKey2}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        ...config,
        max_tokens: undefined,
        stream: true,
      }),
    });
  } else if (!response.ok) throw new Error(await response.text());

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
  if (apiKey1) headers.Authorization = `Bearer ${apiKey1}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages,
      ...config,
      max_tokens: undefined,
      stream: true,
    }),
  });
  if (response.status === 429) {
    if (apiKey2) headers.Authorization = `Bearer ${apiKey2}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        ...config,
        max_tokens: undefined,
        stream: true,
      }),
    });
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

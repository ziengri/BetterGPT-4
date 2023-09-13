import { ShareGPTSubmitBodyInterface } from '@type/api';
import { ConfigInterface, MessageInterface } from '@type/chat';

const apiKey: string | undefined = import.meta.env.VITE_OPENAI_API_KEY;
const secondary_endpoint_base = import.meta.env.VITE_OPENAI_SECONDARY_URL;
export const getChatCompletion = async (
  messages: MessageInterface[],
  config: ConfigInterface,
  customHeaders?: Record<string, string>
): Promise<any> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(customHeaders || {}),
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const modelInfo = await fetchModelInfo(); // Fetch model info from your API
  const endpointToUse = determineEndpoint(modelInfo, config.model);

  const response = await fetch(endpointToUse, {
    method: 'POST',
    headers: {
      ...(headers as Record<string, string>),
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

async function fetchModelInfo(): Promise<any> {
  // Fetch model information from your API and return it as JSON
  const response = await fetch(`${secondary_endpoint_base}/models`);
  if (!response.ok) throw new Error('Failed to fetch model info');
  return response.json();
}

function determineEndpoint(modelInfo: any, selectedModel: string): string {
  // Extract the list of model IDs from the fetched JSON data
  const modelIds = modelInfo.data.map((model: any) => model.id);

  // Check if the selectedModel is in the list of model IDs
  if (modelIds.includes(selectedModel)) {
    return (
      `${secondary_endpoint_base}/chat/completions` ||
      'https://api.openai.com/v1/chat/completions'
    );
  } else {
    return (
      import.meta.env.VITE_OPENAI_BASE_URL ||
      'https://api.openai.com/v1/chat/completions'
    );
  }
}

export const getChatCompletionStream = async (
  messages: MessageInterface[],
  config: ConfigInterface,
  customHeaders?: Record<string, string>
): Promise<any> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(customHeaders || {}),
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  const modelInfo = await fetchModelInfo(); // Fetch model info from your API
  const endpoint = determineEndpoint(modelInfo, config.model);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...(headers as Record<string, string>),
    },
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
    try {
      throw new Error(JSON.parse(responseText).error);
    } catch (e) {
      throw new Error(responseText);
    }
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

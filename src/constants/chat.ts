import { v4 as uuidv4 } from 'uuid';
import { ChatInterface, ConfigInterface, ModelOptions } from '@type/chat';
import useStore from '@store/store';

const date = new Date();
const dateString =
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2);

export const _defaultSystemMessage =
  import.meta.env.VITE_DEFAULT_SYSTEM_MESSAGE ??
  `You are GPT, a large language model trained by OpenAI.
Carefully heed the user's instructions and follow the user's will. 
Respond using Markdown.`;

export const modelOptions: ModelOptions[] = [
  'gpt-4',
  'gpt-4-poe',
  'gpt-4-32k',
  'gpt-4-32k-poe',
  'gpt-4-0314',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-poe',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-16k-poe',
  'gpt-3.5-turbo-0301',
  'sage',
  'claude-instant',
  'claude-2-100k',
  'claude-instant-100k',
  'chat-bison-001',
];

export const defaultModel = 'gpt-3.5-turbo-16k';

export const modelMaxToken = {
  'gpt-4': 7400,
  'gpt-4-poe': 2100,
  'gpt-4-32k': 32768,
  'gpt-4-32k-poe': 32768,
  'gpt-4-0314': 8192,
  'gpt-3.5-turbo': 4000,
  'gpt-3.5-turbo-poe': 2800,
  'gpt-3.5-turbo-16k': 16000,
  'gpt-3.5-turbo-16k-poe': 16000,
  'gpt-3.5-turbo-0301': 4000,
  'sage': 5200,
  'claude-instant': 11000,
  'claude-2-100k': 100000,
  'claude-instant-100k': 100000,
  'chat-bison-001': 10000,
};

export const modelCost = {};

export const defaultUserMaxToken = 100000;

export const _defaultChatConfig: ConfigInterface = {
  model: defaultModel,
  max_tokens: defaultUserMaxToken,
  temperature: 1,
  presence_penalty: 0,
  top_p: 1,
  frequency_penalty: 0,
};

export const generateDefaultChat = (
  title?: string,
  folder?: string
): ChatInterface => ({
  id: uuidv4(),
  title: title ? title : 'New Chat',
  messages:
    useStore.getState().defaultSystemMessage.length > 0
      ? [{ role: 'system', content: useStore.getState().defaultSystemMessage }]
      : [],
  config: { ...useStore.getState().defaultChatConfig },
  titleSet: false,
  folder,
});

export const codeLanguageSubset = [
  'python',
  'javascript',
  'java',
  'go',
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'graphql',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'php-template',
  'plaintext',
  'python-repl',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'vbnet',
  'wasm',
  'xml',
  'yaml',
];

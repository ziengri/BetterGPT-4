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
  `Carefully heed the user's instructions and follow the user's will to the best of your ability.
Respond using Markdown.`;

export const modelOptions: ModelOptions[] = [
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-16k-0613',
  'gpt-3.5-turbo-16k-0301',
  'llama-2-70b-chat',
  'code-llama-34b-instruct',
  'oasst-sft-6-llama-30b',
  'gpt-4-0613',
  'gpt-4-0314',
  'gpt-4-32k',
  'claude-2',
  'claude-instant',
];

export const defaultModel = 'gpt-3.5-turbo-16k-0613';

export const modelMaxToken = {
  'gpt-4-0613': 8192,
  'gpt-4-32k': 32768,
  'gpt-4-0314': 8192,
  'gpt-3.5-turbo-0613': 4097,
  'gpt-3.5-turbo-16k-0613': 16384,
  'gpt-3.5-turbo-0301': 4097,
  'gpt-3.5-turbo-16k-0301': 16384,
  'llama-2-70b-chat': 8192,
  'oasst-sft-6-llama-30b': 8192,
  'code-llama-34b-instruct': 8192,
  'claude-2': 100000,
  'claude-instant': 10000,
};

export const modelCost = {};

export const defaultUserMaxToken = 16384;

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

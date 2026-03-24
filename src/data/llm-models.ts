export interface LLMModel {
  name: string;
  param: number;
  q4gb: number;
  minRam: number;
}

export const LLM_MODELS: LLMModel[] = [
  { name: 'Llama 3.1 8B', param: 8, q4gb: 4.5, minRam: 12 },
  { name: 'Qwen2.5 14B', param: 14, q4gb: 8.5, minRam: 18 },
  { name: 'DeepSeek-R1 27B', param: 27, q4gb: 17, minRam: 24 },
  { name: 'Qwen2.5 32B', param: 32, q4gb: 19, minRam: 28 },
  { name: 'Llama 3.1 70B', param: 70, q4gb: 40, minRam: 48 },
];

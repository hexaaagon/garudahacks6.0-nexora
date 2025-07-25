declare module "puter" {
  interface PuterAI {
    chat(messages: Array<{ role: string; content: string }>): Promise<string>;
  }

  interface Puter {
    init(): Promise<void>;
    ai: PuterAI;
  }

  const puter: Puter;
  export default puter;
}

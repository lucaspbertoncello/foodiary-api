export interface IWorker<TInput extends Record<string, unknown>> {
  consume(input: TInput): Promise<void>;
}

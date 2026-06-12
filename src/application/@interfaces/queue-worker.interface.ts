export interface IQueueWorker<TInput extends Record<string, unknown>> {
  consume(input: TInput): Promise<void>;
}

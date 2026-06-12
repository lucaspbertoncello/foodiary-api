export interface IQueueProducer<TInput extends Record<string, unknown>> {
  publish(input: TInput): Promise<void>;
}

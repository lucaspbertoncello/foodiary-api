export interface IFileEventHandler {
  handle(input: IFileEventHandler.Input): Promise<IFileEventHandler.Output>;
}

export namespace IFileEventHandler {
  export type Input = { fileKey: string };
  export type Output = void;
}

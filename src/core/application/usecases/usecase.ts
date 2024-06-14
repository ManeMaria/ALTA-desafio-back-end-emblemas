export interface IUseCase<Params = unknown, Result = unknown> {
  perform(params: Params): Result | Promise<Result>;
}

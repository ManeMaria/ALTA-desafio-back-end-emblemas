export interface IController<Request = unknown, Response = unknown> {
  execute(request: Request): Response | Promise<Response>;
}

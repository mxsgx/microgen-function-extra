export default class HttpError extends Error {
  public name: string = 'HttpError';
  public statusCode: number = 400;
  public isHttpError: boolean = true;

  constructor(message?: string | undefined) {
    super(message);
  }
}

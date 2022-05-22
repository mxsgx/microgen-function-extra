export default class HttpError extends Error {
  public name: string = 'HttpError';
  public statusCode: number = 400;

  constructor(message?: string | undefined) {
    super(message);
  }
}

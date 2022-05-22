import HttpError from './HttpError';

export default class UnauthorizedError extends HttpError {
  public name: string = 'Unauthorized';
  public statusCode: number = 401;

  constructor(message: string | undefined = 'Unauthorized') {
    super(message);
  }
}

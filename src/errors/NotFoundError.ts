import HttpError from './HttpError';

export default class NotFoundError extends HttpError {
  public name: string = 'NotFoundError';
  public statusCode: number = 404;

  constructor(message: string | undefined = 'Not Found') {
    super(message);
  }
}

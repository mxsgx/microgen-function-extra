import HttpError from './HttpError';

export default class UnprocessableEntityError extends HttpError {
  public name: string = 'UnprocessableEntityError';
  public statusCode: number = 422;

  constructor(message: string | undefined = 'Unprocessable Entity') {
    super(message);
  }
}

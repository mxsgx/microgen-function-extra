interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

interface Auth {
  _id: string;
  user: User | string;
  token: string;
  expiresIn: number;
}

interface PasswordReset {
  _id: string;
  user: User | string;
  token: string;
  hash: string;
}

interface HttpResponse {
  status: string;
  data?: any;
  message?: string;
}

interface SuccessResponse extends HttpResponse {
  status: 'success';
  data: any;
}

interface FailResponse extends HttpResponse {
  status: 'fail';
  data: any;
}

interface ErrorResponse extends HttpResponse {
  status: 'error';
  message: string;
}

interface LoginResponse extends SuccessResponse {
  data: {
    token: string;
    user: User;
  };
}

interface MongoURLBuilderServer {
  host: string;
  port?: number;
}

interface MongoURLBuilderConfig {
  protocol?: 'mongodb' | string;
  auth?: {
    user: string;
    password: string;
  };
  database?: string;
  servers: MongoURLBuilderServer[];
  options?: {
    [index: string]: string | number;
  };
}

declare namespace Express {
  export interface Application {
    env: {
      ENVIRONMENT: 'development' | 'staging' | 'production';
      [index: string]: any;
    };
  }

  export interface Request {
    auth?: {
      token: string;
      user: User;
    };
  }
}

declare namespace NodeJS {
  export interface ProcessEnv {
    [key: string]: string;
  }
}

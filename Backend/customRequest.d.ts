
declare namespace Express {
    export interface Request {
        user:JwtPayload|string|null|Object|any
    }
    export interface Response {
        user: JwtPayload|string|null|Object|any
    }
  }
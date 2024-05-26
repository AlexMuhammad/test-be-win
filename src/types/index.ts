import { Request } from "express";

interface AuthorizationRequest extends Request {
  userData?: {
    id: number;
  };
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface ValidationRequest extends Request {
  userData: UserData;
}

export { AuthorizationRequest, ValidationRequest, UserData };

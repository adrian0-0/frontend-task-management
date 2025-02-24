export interface IResponse<T> {
  message: string;
  statusCode: number;
  data?: T;
}

export interface IAlertResonse {
  statusCode: number;
  message: string;
  severity: Severity;
}

export enum Severity {
  SUCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

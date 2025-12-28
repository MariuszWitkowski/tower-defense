import { singleton } from "tsyringe";

export interface IError {
  message: string;
  stack?: string;
}

@singleton()
export default class ErrorHandler {
  private errors: IError[] = [];

  public addError(error: Error): void {
    console.error(error);
    this.errors.push({
      message: error.message,
      stack: error.stack,
    });
  }

  public getErrors(): IError[] {
    return this.errors;
  }

  public clearErrors(): void {
    this.errors = [];
  }
}

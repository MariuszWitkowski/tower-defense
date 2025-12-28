import { singleton } from "tsyringe";
import { IError } from "./ErrorHandler";

@singleton()
export default class ErrorDisplay {
  private errorList: HTMLElement;

  constructor() {
    const errorContainer = document.createElement("div");
    errorContainer.id = "error-container";
    document.body.appendChild(errorContainer);

    this.errorList = document.createElement("ul");
    errorContainer.appendChild(this.errorList);
  }

  public addError(error: IError): void {
    const errorItem = document.createElement("li");
    errorItem.innerHTML = `<strong>${error.message}</strong><br><pre>${error.stack}</pre>`;
    this.errorList.appendChild(errorItem);
  }

  public clearErrors(): void {
    this.errorList.innerHTML = "";
  }
}

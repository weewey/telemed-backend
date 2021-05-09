export default class RepositoryError extends Error {

  public readonly code: string;

  public constructor(
    code: string,
    message: string,
  ) {
    super(message || "");
    this.code = code;
  }
}


export default class RepositoryError extends Error {
  public constructor(code: string) {
    super(code);
  }
}

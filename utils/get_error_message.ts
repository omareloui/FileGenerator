export interface BaseError {
  name: string;
  message: string;
}

export function getErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) {
    return (e as BaseError).message;
  }

  return `Can't parse the error message. Error: ${e}`;
}

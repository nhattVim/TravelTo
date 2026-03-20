const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type ApiFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export class ApiHttpError extends Error {
  status: number;
  payload?: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const raw = await response.text();
    let payload: unknown = raw;
    let message = raw || "Request thất bại";

    try {
      const parsed = JSON.parse(raw) as { message?: string; error?: string };
      payload = parsed;
      message = parsed.message || parsed.error || message;
    } catch {
      // Keep raw text when response is not JSON.
    }

    throw new ApiHttpError(response.status, message, payload);
  }

  return (await response.json()) as T;
}

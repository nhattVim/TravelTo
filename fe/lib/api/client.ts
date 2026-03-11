const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type ApiFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

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
    const message = await response.text();
    throw new Error(message || "Request thất bại");
  }

  return (await response.json()) as T;
}

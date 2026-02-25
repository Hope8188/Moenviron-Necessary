import { supabaseFunctionAuthHeaders } from "@/integrations/supabase/functionHeaders";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";

interface InvokeResult<T> {
  data: T | null;
  error: Error | null;
}

export async function invokeEdgeFunction<T>(
  functionName: string,
  body: unknown
): Promise<InvokeResult<T>> {
  if (!SUPABASE_URL || !supabaseFunctionAuthHeaders) {
    return {
      data: null,
      error: new Error("Missing Supabase environment variables"),
    };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...supabaseFunctionAuthHeaders,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const message =
        (parsed && (parsed.error || parsed.message)) ||
        `Request failed with status ${response.status}`;
      return {
        data: parsed,
        error: new Error(message),
      };
    }

    return {
      data: parsed,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown edge function error"),
    };
  }
}

import https from "https";
import http from "http";
import type { IncomingMessage } from "http";

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface FetchResult {
  ok: boolean;
  status: number;
  json: () => unknown;
  text: () => string;
}

// The upstream API returns malformed headers (newline in header value) which
// Node.js / undici's strict parser rejects. This wrapper uses the native http
// module with insecureHTTPParser: true to tolerate those responses.
export function apiFetch(
  url: string,
  options: RequestOptions = {},
): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === "https:";
    const client = isHttps ? https : http;

    const req = client.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: options.method ?? "GET",
        headers: options.headers ?? {},
        insecureHTTPParser: true,
      },
      (res: IncomingMessage) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          const status = res.statusCode ?? 0;
          resolve({
            ok: status >= 200 && status < 300,
            status,
            json: () => JSON.parse(body),
            text: () => body,
          });
        });
        res.on("error", reject);
      },
    );

    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

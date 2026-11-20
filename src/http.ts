import { LearnWorldsError } from "./errors.js";

/** Any function compatible with the standard `fetch` signature. */
export type FetchFn = (
	input: string | URL | Request,
	init?: RequestInit,
) => Promise<Response>;

/** Already validated and normalized config (built by `LearnWorldsClient`). `baseUrl` always ends with `/`. */
export interface HttpConfig {
	baseUrl: string;
	clientId: string;
	clientSecret: string;
	fetch: FetchFn;
}

export interface AccessTokenRequest {
	client_id: string;
	client_secret: string;
	grant_type: string;
}

export interface AccessTokenResponse {
	tokenData: {
		access_token: string;
		token_type: string;
		expires_in: number;
	};
	errors: AccessTokenError[];
	success: boolean;
}

export interface AccessTokenError {
	code: string;
	context: string;
	message: string;
}

type QueryValue = string | number | boolean | undefined;

export interface RequestOptions {
	query?: Record<string, QueryValue | QueryValue[]>;
	body?: unknown;
	signal?: AbortSignal;
}

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class HttpClient {
	#version: string = "v2";
	#config: HttpConfig;
	#tokenPromise: Promise<string> | undefined;
	#token: { value: string; expiresAt: number } | undefined;

	constructor(config: HttpConfig) {
		this.#config = config;
	}

	async request<T>(
		method: RequestMethod,
		path: string,
		opts: RequestOptions = {},
	): Promise<T> {
		try {
			const baseUrl: string = `${this.#config.baseUrl}${this.#version}/`;

			const url: URL = new URL(path.replace(/^\//, ""), baseUrl);

			for (const [key, value] of Object.entries(opts.query ?? {})) {
				if (Array.isArray(value)) {
					for (const v of value) {
						if (v !== undefined) url.searchParams.append(`${key}[]`, String(v));
					}
				} else if (value !== undefined)
					url.searchParams.set(key, String(value));
			}

			const response: Response = await this.#config.fetch(url, {
				method,
				headers: {
					Authorization: `Bearer ${await this.#getToken()}`,
					"Lw-Client": this.#config.clientId,
					...(method !== "GET" &&
						opts.body !== undefined && { "Content-Type": "application/json" }),
				},
				body:
					method !== "GET" && opts.body !== undefined
						? JSON.stringify(opts.body)
						: undefined,
				signal: opts.signal ?? undefined,
			});

			if (!response.ok) {
				throw new LearnWorldsError(
					`[${method}] ${path} failed with ${response.status}`,
					{
						status: response.status,
						body: await this.#parseBody(response),
					},
				);
			}

			if (response.status === 204) return undefined as T;
			return (await response.json()) as T;
		} catch (error) {
			if (!(error instanceof LearnWorldsError)) {
				throw new LearnWorldsError(`[${method}] ${path} request failed`, {
					cause: error,
				});
			}

			throw error;
		}
	}

	async #parseBody(response: Response): Promise<unknown> {
		const text: string = await response.text();
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	}

	async #getToken(): Promise<string> {
		if (this.#token && Date.now() < this.#token.expiresAt - 60_000)
			return this.#token.value;

		this.#tokenPromise ??= this.#fetchToken().finally(
			() => (this.#tokenPromise = undefined),
		);
		return this.#tokenPromise;
	}

	async #fetchToken(): Promise<string> {
		try {
			const url: URL = new URL("oauth2/access_token", this.#config.baseUrl);
			const body: AccessTokenRequest = {
				client_id: this.#config.clientId,
				client_secret: this.#config.clientSecret,
				grant_type: "client_credentials",
			};

			const response: Response = await this.#config.fetch(url, {
				method: "POST",
				headers: {
					"Lw-Client": this.#config.clientId,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!response.ok)
				throw new LearnWorldsError("Unable to get access token", {
					status: response.status,
					body: await this.#parseBody(response),
				});
			const data: AccessTokenResponse =
				(await response.json()) as AccessTokenResponse;

			if (!data.success) {
				throw new LearnWorldsError("Unable to get access token", {
					status: response.status,
					body: data,
				});
			}

			this.#token = {
				value: data.tokenData.access_token,
				expiresAt: Date.now() + data.tokenData.expires_in * 1000,
			};
			return this.#token.value;
		} catch (error) {
			if (!(error instanceof LearnWorldsError)) {
				throw new LearnWorldsError("Unable to get access token", {
					cause: error,
				});
			}

			throw error;
		}
	}
}

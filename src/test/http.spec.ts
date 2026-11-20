import { describe, expect, it, mock } from "bun:test";
import { HttpClient } from "../http.js";
import { LearnWorldsError } from "../errors.js";

describe("HTTP client", () => {
	const tokenResponse = () =>
		Response.json({
			success: true,
			errors: [],
			tokenData: { access_token: "T", token_type: "Bearer", expires_in: 3600 },
		});
	const createClient = (
		handler: (url: URL, init?: RequestInit) => Response | Promise<Response>,
	) => {
		const fetchMock = mock(
			async (input: string | URL | Request, init?: RequestInit) =>
				handler(new URL(String(input)), init),
		);
		const http = new HttpClient({
			baseUrl: "https://school.com/admin/api/",
			clientId: "cid",
			clientSecret: "secret",
			fetch: fetchMock as unknown as typeof fetch,
		});
		return { http, fetchMock };
	};

	it("Should create the instance", () => {
		const { http } = createClient((url) =>
			url.pathname.includes("oauth2")
				? tokenResponse()
				: Response.json({ id: "u1" }),
		);
		expect(http instanceof HttpClient).toBe(true);
	});

	it("Should send the token and the Lw-Client header", async () => {
		const { http, fetchMock } = createClient((url) =>
			url.pathname.includes("oauth2")
				? tokenResponse()
				: Response.json({ id: "u1" }),
		);
		const user = await http.request("GET", "users/u1");

		expect(user).toEqual({ id: "u1" });
		expect(fetchMock).toHaveBeenCalledTimes(2);
		const init = fetchMock.mock.calls[1]?.[1];
		expect(init?.headers).toMatchObject({
			Authorization: "Bearer T",
			"Lw-Client": "cid",
		});
	});

	it("Should throw a LearnWorldsError when the token request is rejected", async () => {
		const { http, fetchMock } = createClient((url) => {
			if (url.pathname.includes("oauth2"))
				throw new TypeError("Token fetch failed");
			return Response.json({ id: "u1" });
		});

		await expect(http.request("GET", "users/u1")).rejects.toBeInstanceOf(
			LearnWorldsError,
		);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("Should throw a LearnWorldsError when the resource request is rejected", async () => {
		const { http, fetchMock } = createClient((url) => {
			if (url.pathname.includes("oauth2")) return tokenResponse();
			throw new TypeError("Resource error");
		});

		await expect(http.request("GET", "users/u1")).rejects.toBeInstanceOf(
			LearnWorldsError,
		);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe("HTTP client errors and token cache", () => {
	const tokenResponse = () =>
		Response.json({
			success: true,
			errors: [],
			tokenData: { access_token: "T", token_type: "Bearer", expires_in: 3600 },
		});
	const createClient = (respond: () => Response) => {
		const fetchMock = mock(async (input: string | URL | Request) =>
			String(input).includes("oauth2") ? tokenResponse() : respond(),
		);
		const http = new HttpClient({
			baseUrl: "https://school.com/admin/api/",
			clientId: "cid",
			clientSecret: "secret",
			fetch: fetchMock as unknown as typeof fetch,
		});
		return { http, fetchMock };
	};

	it("Should parse a JSON error body", async () => {
		const { http } = createClient(() =>
			Response.json({ error: "Payments not found" }, { status: 404 }),
		);
		const error = await http
			.request<never>("GET", "payments")
			.catch((e: LearnWorldsError) => e);

		expect(error).toBeInstanceOf(LearnWorldsError);
		expect(error.status).toBe(404);
		expect(error.body).toEqual({ error: "Payments not found" });
		expect(error.message).toBe("[GET] payments failed with 404");
	});

	it("Should keep a non-JSON error body as text", async () => {
		const { http } = createClient(
			() => new Response("Bad Gateway", { status: 502 }),
		);
		const error = await http
			.request<never>("GET", "payments")
			.catch((e: LearnWorldsError) => e);

		expect(error.status).toBe(502);
		expect(error.body).toBe("Bad Gateway");
	});

	it("Should reuse the cached token between requests", async () => {
		const { http, fetchMock } = createClient(() => Response.json({}));
		await http.request("GET", "users");
		await http.request("GET", "courses");

		const tokenCalls = fetchMock.mock.calls.filter(([input]) =>
			String(input).includes("oauth2"),
		);
		expect(tokenCalls).toHaveLength(1);
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	it("Should request the token only once for concurrent requests", async () => {
		const { http, fetchMock } = createClient(() => Response.json({}));
		await Promise.all([
			http.request("GET", "users"),
			http.request("GET", "courses"),
			http.request("GET", "bundles"),
		]);

		const tokenCalls = fetchMock.mock.calls.filter(([input]) =>
			String(input).includes("oauth2"),
		);
		expect(tokenCalls).toHaveLength(1);
	});
});

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

import type { HttpClient } from "../../http.js";
import type { PageQuery, Paginated } from "../../types.js";
import type { Bundle } from "./bundles.model.js";

/**
 * Methods for the bundles endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const bundles = await lw.bundles.getAll();
 * ```
 */
export class BundlesResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list of all bundles of the school. The bundles are in sorted order, with the most recently created bundle appearing first,
	 * and the list is paginated, with a limit of 20 bundles per page.
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<Bundle>> {
		return this.#http.request("GET", `bundles`, { query, signal });
	}

	/**
	 * Returns the bundle specified by the provided bundle id.
	 * @param id      - Bundle id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async get(id: string, signal?: AbortSignal): Promise<Bundle> {
		return this.#http.request("GET", `bundles/${encodeURIComponent(id)}`, {
			signal,
		});
	}
}

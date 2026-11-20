import type { HttpClient } from "../../http.js";
import type { PageQuery, Paginated } from "../../types.js";
import type { Lead } from "./leads.model.js";

/**
 * Methods for the leads endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const leads = await lw.leads.getAll();
 * ```
 */
export class LeadsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the leads of the school.
	 * The leads are in sorted order, with the most recently created lead appearing first,
	 * and the list is paginated, with a limit of 20 leads per page.
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<Lead>> {
		return this.#http.request("GET", "leads", { query, signal });
	}
}

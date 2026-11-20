import type { HttpClient } from "../../http.js";
import type { Paginated } from "../../types.js";
import type { Installment } from "./installments.model.js";

/**
 * Methods for the installments endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const installments = await lw.installments.getActive();
 * ```
 */
export class InstallmentsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with active installments of users.
	 * The installments are in sorted order based on user's creation date in descending order,
	 * and the list is paginated, with a limit of 50 installments per page.
	 * If more than one filter is provided, all of them are applied (AND).
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getActive(
		query?: {
			page?: number;
			product_id?: string;
			product_type?: Installment["productType"];
			user_id?: string;
		},
		signal?: AbortSignal,
	): Promise<Paginated<Installment>> {
		return this.#http.request("GET", "installments/active", { query, signal });
	}
}

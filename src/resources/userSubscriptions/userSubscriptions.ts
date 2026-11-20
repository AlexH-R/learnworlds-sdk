import type { HttpClient } from "../../http.js";
import type { Paginated } from "../../types.js";
import type { UserSubscription } from "./userSubscriptions.model.js";

/**
 * Methods for the user subscription plans endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const subscriptions = await lw.userSubscriptions.getAll();
 * ```
 */
export class UserSubscriptionsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with the user subscriptions.
	 * The subscriptions are in sorted order based on user's creation date in descending order and the list is paginated,
	 * with a limit of 20 subscriptions per page.
	 * If more than one filter is provided, all of them are applied (AND).
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: {
			page?: number;
			status?: UserSubscription["status"];
			user_id?: string;
		},
		signal?: AbortSignal,
	): Promise<Paginated<UserSubscription>> {
		return this.#http.request("GET", "user-subscriptions", { query, signal });
	}
}

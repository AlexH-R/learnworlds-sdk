import type { HttpClient } from "../../http.js";
import type { PageQuery, Paginated } from "../../types.js";
import type { SubscriptionPlan } from "./subscriptionPlans.model.js";

/**
 * Methods for the subscription plans endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const plans = await lw.subscriptionPlans.getAll();
 * ```
 */
export class SubscriptionPlansResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list of all subscription plans.
	 * The subscription plans are in sorted order, with the most recently created subscription plan appearing first,
	 * and the list is paginated, with a limit of 50 subscription plans per page.
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<SubscriptionPlan>> {
		return this.#http.request("GET", "subscription-plans", { query, signal });
	}

	/**
	 * Returns the subscription plan specified by the provided subscription plan id.
	 *
	 * @param id      - Subscription plan id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async get(id: string, signal?: AbortSignal): Promise<SubscriptionPlan> {
		return this.#http.request(
			"GET",
			`subscription-plans/${encodeURIComponent(id)}`,
			{ signal },
		);
	}
}

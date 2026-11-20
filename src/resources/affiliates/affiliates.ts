import type { HttpClient } from "../../http.js";
import type { PageQuery, Paginated } from "../../types.js";
import type { Payment } from "../payments/payments.model.js";
import type { User } from "../users/users.model.js";
import type {
	Affiliate,
	AffiliateCreationRequest,
	Payout,
	PendingPayout,
} from "./affiliates.model.js";

/**
 * Methods for the affiliates endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const affiliates = await lw.affiliates.getAll();
 * ```
 */
export class AffiliatesResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the affiliates of the school.
	 * The affiliates are in sorted order, with the most recently created affiliate appearing first,
	 * and the list is paginated, with a limit of 20 affiliates per page.
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<Affiliate>> {
		return this.#http.request("GET", "affiliates", { query, signal });
	}

	/**
	 * Makes the user specified by the provided user id an affiliate.
	 * The endpoint response is the Affiliate resource.
	 *
	 * @param id      - User id or email
	 * @param body    - Optional affiliate settings
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async create(
		id: string,
		body?: AffiliateCreationRequest,
		signal?: AbortSignal,
	): Promise<{ data: Affiliate }> {
		return this.#http.request("POST", `affiliates/${encodeURIComponent(id)}`, {
			body,
			signal,
		});
	}

	/**
	 * Returns all the leads connected with the affiliate specified by the provided affiliate id.
	 * The leads are in sorted order, with the most recently created lead appearing first,
	 * and the list is paginated, with a limit of 20 leads per page.
	 *
	 * @param id      - Affiliate id or email
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getLeads(
		id: string,
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<User>> {
		return this.#http.request(
			"GET",
			`affiliates/${encodeURIComponent(id)}/leads`,
			{ query, signal },
		);
	}

	/**
	 * Returns all the customers connected with the affiliate specified by the provided affiliate id.
	 * The customers are in sorted order, with the most recently created customer appearing first,
	 * and the list is paginated, with a limit of 20 customers per page.
	 *
	 * @param id      - Affiliate id or email
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getCustomers(
		id: string,
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<User>> {
		return this.#http.request(
			"GET",
			`affiliates/${encodeURIComponent(id)}/customers`,
			{ query, signal },
		);
	}

	/**
	 * Returns all the payments of the affiliate specified by the provided affiliate id.
	 * The payments are in sorted order, with the most recently created payment appearing first,
	 * and the list is paginated, with a limit of 50 payments per page.
	 *
	 * @param id      - Affiliate id or email
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getPayments(
		id: string,
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<Payment>> {
		return this.#http.request(
			"GET",
			`affiliates/${encodeURIComponent(id)}/payments`,
			{ query, signal },
		);
	}

	/**
	 * Returns the upcoming payouts of the affiliate specified by the provided affiliate id.
	 *
	 * @param id      - Affiliate id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getUpcomingPayouts(
		id: string,
		signal?: AbortSignal,
	): Promise<{ data: PendingPayout[] }> {
		return this.#http.request(
			"GET",
			`affiliates/${encodeURIComponent(id)}/payouts/upcoming`,
			{ signal },
		);
	}

	/**
	 * Returns the due payouts of the affiliate specified by the provided affiliate id.
	 *
	 * @param id      - Affiliate id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getDuePayouts(
		id: string,
		signal?: AbortSignal,
	): Promise<{ data: PendingPayout[] }> {
		return this.#http.request(
			"GET",
			`affiliates/${encodeURIComponent(id)}/payouts/due`,
			{ signal },
		);
	}

	/**
	 * Returns all the completed payouts of the affiliate specified by the provided affiliate id.
	 * The payouts are in sorted order, with the most recently created payout appearing first,
	 * and the list is paginated, with a limit of 20 payouts per page.
	 *
	 * @param id      - Affiliate id or email
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getCompletedPayouts(
		id: string,
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<Payout>> {
		return this.#http.request(
			"GET",
			`affiliates/${encodeURIComponent(id)}/payouts/completed`,
			{ query, signal },
		);
	}
}

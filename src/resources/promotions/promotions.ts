import type { HttpClient } from "../../http.js";
import type { PageQuery, Paginated } from "../../types.js";
import type {
	BulkCouponCreationRequest,
	Coupon,
	CouponCreationRequest,
	CouponUsage,
	Promotion,
	PromotionCreationRequest,
} from "./promotions.model.js";

/**
 * Methods for the promotions endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorldsClient({ baseUrl, clientId, clientSecret });
 * const promotions = await lw.promotions.getAll();
 * ```
 */
export class PromotionsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the promotions of the school.
	 * The promotions are in sorted order, with the most recently created promotion appearing first,
	 * and the list is paginated, with a limit of 20 promotions per page.
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<Promotion>> {
		return this.#http.request("GET", "promotions", { query, signal });
	}

	/**
	 * Creates a new promotion without coupons. The endpoint response is the created Promotion resource.
	 *
	 * @param body    - Data for the promotion to create
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async create(
		body: PromotionCreationRequest,
		signal?: AbortSignal,
	): Promise<Promotion> {
		return this.#http.request("POST", "promotions", { body, signal });
	}

	/**
	 * Returns the promotion specified by the provided promotion id.
	 *
	 * @param id      - Promotion id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async get(id: string, signal?: AbortSignal): Promise<Promotion> {
		return this.#http.request("GET", `promotions/${encodeURIComponent(id)}`, {
			signal,
		});
	}

	/**
	 * Returns all the coupons of the promotion specified by the provided promotion id.
	 *
	 * @param id      - Promotion id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getCoupons(
		id: string,
		signal?: AbortSignal,
	): Promise<{ data: Coupon[] }> {
		return this.#http.request(
			"GET",
			`promotions/${encodeURIComponent(id)}/coupons`,
			{ signal },
		);
	}

	/**
	 * Creates a coupon in the promotion specified by the provided promotion id.
	 * The endpoint response is the created Coupon resource.
	 *
	 * @param id      - Promotion id
	 * @param body    - Data for the coupon to create
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async createCoupon(
		id: string,
		body: CouponCreationRequest,
		signal?: AbortSignal,
	): Promise<Coupon> {
		return this.#http.request(
			"POST",
			`promotions/${encodeURIComponent(id)}/coupons`,
			{ body, signal },
		);
	}

	/**
	 * Creates coupons in bulk in the promotion specified by the provided promotion id.
	 * The endpoint response is an array with the created Coupon resources.
	 *
	 * @param id      - Promotion id
	 * @param body    - Data for the coupons to create
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async createBulkCoupons(
		id: string,
		body: BulkCouponCreationRequest,
		signal?: AbortSignal,
	): Promise<Coupon[]> {
		return this.#http.request(
			"POST",
			`promotions/${encodeURIComponent(id)}/coupons-bulk`,
			{ body, signal },
		);
	}

	/**
	 * Returns the usage details of the coupon specified by the provided promotion id and coupon code,
	 * along with the associated payments.
	 * The payments are in sorted order, with the most recently created payment appearing first,
	 * and the list is paginated, with a limit of 50 payments per page.
	 *
	 * @param id      - Promotion id
	 * @param code    - Coupon code
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getCouponUsage(
		id: string,
		code: string,
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<CouponUsage> {
		return this.#http.request(
			"GET",
			`promotions/${encodeURIComponent(id)}/coupons/${encodeURIComponent(code)}/usage`,
			{ query, signal },
		);
	}
}

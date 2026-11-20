import type { HttpClient } from "../../http.js";
import type { Paginated } from "../../types.js";
import type { Invoice, Payment, PaymentsRequest } from "./payments.model.js";

/**
 * Methods for the payments endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorldsClient({ baseUrl, clientId, clientSecret });
 * const payments = await lw.payments.getAll();
 * ```
 */
export class PaymentsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the payments.
	 * The payments are in sorted order, with the most recently created payment appearing first,
	 * and the list is paginated, with a default limit of 50 payments per page.
	 * If more than one filter is provided, all of them are applied (AND).
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: PaymentsRequest,
		signal?: AbortSignal,
	): Promise<Paginated<Payment>> {
		return this.#http.request("GET", "payments", { query, signal });
	}

	/**
	 * Returns the payment specified by the provided payment id.
	 *
	 * @param id      - Payment id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async get(id: string, signal?: AbortSignal): Promise<Payment> {
		return this.#http.request("GET", `payments/${encodeURIComponent(id)}`, {
			signal,
		});
	}

	/**
	 * Returns the invoice number and a private, expiring link to access the invoice.
	 *
	 * @param id      - Payment id or transaction id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getInvoiceLink(id: string, signal?: AbortSignal): Promise<Invoice> {
		return this.#http.request(
			"GET",
			`payments/${encodeURIComponent(id)}/invoice-link`,
			{ signal },
		);
	}
}

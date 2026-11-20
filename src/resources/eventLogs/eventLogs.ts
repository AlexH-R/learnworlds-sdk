import type { HttpClient } from "../../http.js";
import type { Paginated } from "../../types.js";
import type { EventLog, EventLogsRequest } from "./eventLogs.model.js";

/**
 * Methods for the event logs endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorldsClient({ baseUrl, clientId, clientSecret });
 * const eventLogs = await lw.eventLogs.getAll();
 * ```
 */
export class EventLogsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the event logs of the school.
	 * The list is paginated, with a limit of 50 event logs per page.
	 * When more than one query param is provided, all of them are applied (AND operator).
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: EventLogsRequest,
		signal?: AbortSignal,
	): Promise<Paginated<EventLog>> {
		return this.#http.request("GET", "event-logs", { query, signal });
	}
}

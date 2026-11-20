import type { HttpClient } from "../../http.js";
import type { SchoolEvent } from "./calendar.model.js";

/**
 * Methods for the calendar endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorldsClient({ baseUrl, clientId, clientSecret });
 * const events = await lw.calendar.getSchoolEvents();
 * ```
 */
export class CalendarResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns all the upcoming scheduled school events,
	 * regarding course drip feed, file assignment and live session.
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getSchoolEvents(
		query?: { event_type?: SchoolEvent["type"] },
		signal?: AbortSignal,
	): Promise<{ data: SchoolEvent[] }> {
		return this.#http.request("GET", "school/events", { query, signal });
	}
}

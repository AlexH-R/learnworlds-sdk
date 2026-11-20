import type { HttpClient } from "../../http.js";
import type { AsyncTaskStatus } from "./asynchronousActions.model.js";

/**
 * Methods for the asynchronous actions endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const status = await lw.asynchronousActions.get("job_id");
 * ```
 */
export class AsynchronousActionsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns the progress of the asynchronous action specified by the provided job id.
	 * Use it with the `job_id` returned by endpoints that run asynchronously.
	 *
	 * @param id      - Job id (the `job_id` of an `AsyncTask`)
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async get(id: string, signal?: AbortSignal): Promise<AsyncTaskStatus> {
		return this.#http.request(
			"GET",
			`async-actions/${encodeURIComponent(id)}`,
			{ signal },
		);
	}
}

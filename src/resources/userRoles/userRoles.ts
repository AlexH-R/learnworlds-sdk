import type { HttpClient } from "../../http.js";
import type { Role } from "./userRoles.model.js";

/**
 * Methods for the user roles endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorldsClient({ baseUrl, clientId, clientSecret });
 * const userRoles = await lw.userRoles.getAll();
 * ```
 */
export class UserRolesResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the user roles of the school.
	 * The roles are in alphabetical ascending order according to their title.
	 *
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(signal?: AbortSignal): Promise<{ data: Role[] }> {
		return this.#http.request("GET", "user-roles", { signal });
	}
}

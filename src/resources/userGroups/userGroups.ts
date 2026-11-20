import type { HttpClient } from "../../http.js";
import type { PageQuery, Paginated } from "../../types.js";
import type { AsyncTask } from "../asynchronousActions/asynchronousActions.model.js";
import type { User } from "../users/users.model.js";
import type {
	UserGroup,
	UserGroupCreationRequest,
	UserGroupModificationRequest,
} from "./userGroups.model.js";

/**
 * Methods for the user groups endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const userGroups = await lw.userGroups.getAll();
 * ```
 */
export class UserGroupsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the user groups of the school.
	 * The user groups are in sorted order, with the most recently created appearing first,
	 * and the list is paginated, with a default limit of 20 user groups per page.
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<UserGroup>> {
		return this.#http.request("GET", "user_groups", { query, signal });
	}

	/**
	 * Returns the user group specified by the provided user group id.
	 *
	 * @param id      - User group id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async get(id: string, signal?: AbortSignal): Promise<UserGroup> {
		return this.#http.request("GET", `user_groups/${encodeURIComponent(id)}`, {
			signal,
		});
	}

	/**
	 * Creates a new user group.
	 *
	 * @param body    - User group data
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async create(
		body: UserGroupCreationRequest,
		signal?: AbortSignal,
	): Promise<UserGroup> {
		return this.#http.request("POST", "user_groups", { body, signal });
	}

	/**
	 * Updates the user group specified by the provided user group id.
	 * Each list in `products` replaces the products of its type only: a list that is left out
	 * keeps the current products of that type, and an empty list removes them.
	 *
	 * @param id      - User group id
	 * @param body    - Fields to update
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async update(
		id: string,
		body: UserGroupModificationRequest,
		signal?: AbortSignal,
	): Promise<UserGroup> {
		return this.#http.request("PUT", `user_groups/${encodeURIComponent(id)}`, {
			body,
			signal,
		});
	}

	/**
	 * Deletes the user group specified by the provided user group id.
	 * The deletion runs asynchronously: use the returned `job_id` with
	 * `lw.asynchronousActions.get` to follow its progress.
	 *
	 * @param id      - User group id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async delete(id: string, signal?: AbortSignal): Promise<AsyncTask> {
		return this.#http.request(
			"DELETE",
			`user_groups/${encodeURIComponent(id)}`,
			{ signal },
		);
	}

	/**
	 * Returns the users who are members of the user group specified by the provided user group id.
	 * The users are in sorted order, with the most recently created user appearing first,
	 * and the list is paginated, with a default limit of 20 users per page.
	 *
	 * @param id      - User group id
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getUsers(
		id: string,
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<User>> {
		return this.#http.request(
			"GET",
			`user_groups/${encodeURIComponent(id)}/users`,
			{ query, signal },
		);
	}

	/**
	 * Adds a user to the user group specified by the provided user group id.
	 *
	 * @param id      - User group id
	 * @param userId  - User id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async addUser(
		id: string,
		userId: string,
		signal?: AbortSignal,
	): Promise<{ success: boolean }> {
		return this.#http.request(
			"POST",
			`user_groups/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
			{ signal },
		);
	}

	/**
	 * Removes a user from the user group specified by the provided user group id.
	 *
	 * @param id      - User group id
	 * @param userId  - User id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async removeUser(
		id: string,
		userId: string,
		signal?: AbortSignal,
	): Promise<void> {
		return this.#http.request(
			"DELETE",
			`user_groups/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
			{ signal },
		);
	}
}

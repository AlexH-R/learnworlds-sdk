import type { HttpClient } from "../../http.js";
import type { PageQuery, Paginated } from "../../types.js";
import type { AsyncTask } from "../asynchronousActions/asynchronousActions.model.js";
import type { User } from "../users/users.model.js";
import type {
	SeatOffering,
	SeatOfferingCreationRequest,
	SeatOfferingModificationRequest,
} from "./seats.model.js";

/**
 * Methods for the seat offerings endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorldsClient({ baseUrl, clientId, clientSecret });
 * const seatOfferings = await lw.seats.getAll();
 * ```
 */
export class SeatsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the seat offerings of the school.
	 * The seat offerings are in sorted order, with the most recently created appearing first,
	 * and the list is paginated, with a default limit of 20 seat offerings per page.
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<SeatOffering>> {
		return this.#http.request("GET", "seats", { query, signal });
	}

	/**
	 * Returns the seat offering specified by the provided seat offering id.
	 *
	 * @param id      - Seat offering id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async get(id: string, signal?: AbortSignal): Promise<SeatOffering> {
		return this.#http.request("GET", `seats/${encodeURIComponent(id)}`, {
			signal,
		});
	}

	/**
	 * Creates a new seat offering.
	 * At least one course or learning program is required in `products`.
	 *
	 * @param body    - Seat offering data
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async create(
		body: SeatOfferingCreationRequest,
		signal?: AbortSignal,
	): Promise<SeatOffering> {
		return this.#http.request("POST", "seats", { body, signal });
	}

	/**
	 * Updates the seat offering specified by the provided seat offering id.
	 * Each list in `products` replaces the products of its type only: a list that is left out
	 * keeps the current products of that type, and an empty list removes them.
	 *
	 * @param id      - Seat offering id
	 * @param body    - Fields to update
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async update(
		id: string,
		body: SeatOfferingModificationRequest,
		signal?: AbortSignal,
	): Promise<SeatOffering> {
		return this.#http.request("PUT", `seats/${encodeURIComponent(id)}`, {
			body,
			signal,
		});
	}

	/**
	 * Deletes the seat offering specified by the provided seat offering id.
	 * The deletion runs asynchronously: use the returned `job_id` with
	 * `lw.asynchronousActions.get` to follow its progress.
	 *
	 * @param id      - Seat offering id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async delete(id: string, signal?: AbortSignal): Promise<AsyncTask> {
		return this.#http.request("DELETE", `seats/${encodeURIComponent(id)}`, {
			signal,
		});
	}

	/**
	 * Returns the users who are members of the seat offering specified by the provided seat offering id.
	 * The users are in sorted order, with the most recently created user appearing first,
	 * and the list is paginated, with a default limit of 20 users per page.
	 *
	 * @param id      - Seat offering id
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getUsers(
		id: string,
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<User>> {
		return this.#http.request("GET", `seats/${encodeURIComponent(id)}/users`, {
			query,
			signal,
		});
	}

	/**
	 * Adds a user to the seat offering specified by the provided seat offering id.
	 *
	 * @param id      - Seat offering id
	 * @param userId  - User id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async addUser(
		id: string,
		userId: string,
		body: { add_to_active_seat: boolean },
		signal?: AbortSignal,
	): Promise<{ success: boolean }> {
		return this.#http.request(
			"POST",
			`seats/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
			{ body, signal },
		);
	}

	/**
	 * Removes a user from their seat and, optionally, from the seat offering.
	 *
	 * @param id      - Seat offering id
	 * @param userId  - User id
	 * @param body    - Whether to also remove the user from the seat offering
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async removeUser(
		id: string,
		userId: string,
		body: { remove_from_seat_offering: boolean },
		signal?: AbortSignal,
	): Promise<void> {
		return this.#http.request(
			"DELETE",
			`seats/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
			{ body, signal },
		);
	}
}

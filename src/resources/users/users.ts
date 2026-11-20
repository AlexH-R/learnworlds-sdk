import type { HttpClient } from "../../http.js";
import type { PageQuery, Paginated } from "../../types.js";
import type { UserGroup } from "../userGroups/userGroups.model.js";
import type {
	Enrollment,
	EnrollmentCreationRequest,
	EnrollmentDeletionRequest,
	Product,
	Segment,
	User,
	UserCreationRequest,
	UserModificationRequest,
	UserRole,
	UserRoleModificationRequest,
	UserSeatOffering,
} from "./users.model.js";

/**
 * Methods for the user endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const users = await lw.users.getAll();
 * ```
 */
export class UsersResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the users of the school.
	 * The users are in sorted order, with the most recently created user appearing first,
	 * and the list is paginated, with a default limit of 20 users per page.
	 * If more than one filter is provided, all of them are applied (AND).
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query?: {
			page?: number;
			[key: `cf_${string}`]: string | undefined;
			include_suspended?: boolean;
			items_per_page?: number;
			registration_after?: number;
			role?: string;
			status?: "paying" | "non_paying" | "suspended" | "never_logged_in";
			tags?: string;
		},
		signal?: AbortSignal,
	): Promise<Paginated<User>> {
		return this.#http.request("GET", "users", { query, signal });
	}

	/**
	 * Creates a new user. The endpoint response is the created User resource.
	 *
	 * @param body    - Info of the user that is going to be created
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async create(body: UserCreationRequest, signal?: AbortSignal): Promise<User> {
		return this.#http.request("POST", "users", { body, signal });
	}

	/**
	 * Updates user information. The endpoint response is the updated User resource.
	 *
	 * @param id      - User id or email
	 * @param body    - Info of the user that is going to be modified
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async update(
		id: string,
		body: UserModificationRequest,
		signal?: AbortSignal,
	): Promise<User> {
		return this.#http.request("PUT", `users/${encodeURIComponent(id)}`, {
			body,
			signal,
		});
	}

	/**
	 * Returns the user specified by the provided user id.
	 *
	 * @param id      - User id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async get(id: string, signal?: AbortSignal): Promise<User> {
		return this.#http.request("GET", `users/${encodeURIComponent(id)}`, {
			signal,
		});
	}

	/**
	 * Returns a list with all course enrollment data of the specified user.
	 * The list is paginated, with a limit of 50 course enrollments per page.
	 *
	 * @param id      - User id or email
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getEnrollments(
		id: string,
		query?: PageQuery,
		signal?: AbortSignal,
	): Promise<Paginated<Enrollment>> {
		return this.#http.request(
			"GET",
			`users/${encodeURIComponent(id)}/courses`,
			{ query, signal },
		);
	}

	/**
	 * Returns a list with all the products of the user specified by the provided user id.
	 *
	 * @param id      - User id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getProducts(
		id: string,
		signal?: AbortSignal,
	): Promise<{
		data: Product[];
	}> {
		return this.#http.request(
			"GET",
			`users/${encodeURIComponent(id)}/products`,
			{ signal },
		);
	}

	/**
	 * Updates the tags of the user specified by the provided user id or email.
	 * The endpoint response is the updated User resource.
	 *
	 * @param id      - User id or email
	 * @param body    - Tags to attach or detach
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async updateTags(
		id: string,
		body: { tags: string[]; action: "attach" | "detach" },
		signal?: AbortSignal,
	): Promise<User> {
		return this.#http.request("PUT", `users/${encodeURIComponent(id)}/tags`, {
			body,
			signal,
		});
	}

	/**
	 * Enrolls the user in a product (course, bundle or manual subscription).
	 *
	 * @param id      - User id or email
	 * @param body    - Enrollment info
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async enroll(
		id: string,
		body: EnrollmentCreationRequest,
		signal?: AbortSignal,
	): Promise<{ success: boolean }> {
		return this.#http.request(
			"POST",
			`users/${encodeURIComponent(id)}/enrollment`,
			{ body, signal },
		);
	}

	/**
	 * Unenrolls the user from the product specified by the provided product id.
	 *
	 * @param id      - User id or email
	 * @param body    - Product to unenroll the user from
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async unenroll(
		id: string,
		body: EnrollmentDeletionRequest,
		signal?: AbortSignal,
	): Promise<void> {
		return this.#http.request(
			"DELETE",
			`users/${encodeURIComponent(id)}/enrollment`,
			{ body, signal },
		);
	}

	/**
	 * Returns a list of all user segments in the school.
	 *
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getSegments(signal?: AbortSignal): Promise<{ data: Segment[] }> {
		return this.#http.request("GET", "users/segments", { signal });
	}

	/**
	 * Suspends a user from logging in or creating another account.
	 * The endpoint response is the suspended User resource.
	 *
	 * Suspending a user also:
	 * - resets their role to learner (if they had a different role)
	 * - removes them from all user groups and seat offerings, releasing the seat
	 * - unenrolls them from the courses they got through those groups; purchased and manually enrolled courses are kept
	 * - ends their active sessions
	 *
	 * Unsuspending restores none of the above: re-add the user to groups and re-assign their role if needed.
	 * This matches suspending from the admin UI.
	 *
	 * @param id      - User id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async suspend(id: string, signal?: AbortSignal): Promise<User> {
		return this.#http.request(
			"PUT",
			`users/${encodeURIComponent(id)}/suspend`,
			{ signal },
		);
	}

	/**
	 * Unsuspends a user. The endpoint response is the unsuspended User resource.
	 *
	 * @param id      - User id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async unsuspend(id: string, signal?: AbortSignal): Promise<User> {
		return this.#http.request(
			"PUT",
			`users/${encodeURIComponent(id)}/unsuspend`,
			{ signal },
		);
	}

	/**
	 * Retrieves all the users in the segment specified by the provided segment id.
	 * The users are in sorted order, with the most recently created user appearing first,
	 * and the list is paginated, with a limit of 20 users per page.
	 *
	 * @param query   - Filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getBySegment(
		query: { segment_id: string; include_suspended?: boolean; page?: number },
		signal?: AbortSignal,
	): Promise<Paginated<User>> {
		return this.#http.request("GET", `users/by-segment`, { query, signal });
	}

	/**
	 * Retrieves all the users with access to the product specified by the provided product id.
	 * The users are in sorted order, with the most recently created user appearing first,
	 * and the list is paginated, with a limit of 20 users per page.
	 *
	 * @param query   - Filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getByProduct(
		query: {
			page?: number;
			product_id: string;
			product_type: "course" | "bundle" | "subscription";
		},
		signal?: AbortSignal,
	): Promise<Paginated<User>> {
		return this.#http.request("GET", `users/by-product`, { query, signal });
	}

	/**
	 * Returns a list of all seat offerings that the specified user is a member of.
	 *
	 * @param id      - User id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getSeats(
		id: string,
		signal?: AbortSignal,
	): Promise<UserSeatOffering[]> {
		return this.#http.request("GET", `users/${encodeURIComponent(id)}/seats`, {
			signal,
		});
	}

	/**
	 * Returns a list of all user groups that the specified user is a member of.
	 *
	 * @param id      - User id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getGroups(
		id: string,
		signal?: AbortSignal,
	): Promise<{
		data: {
			user_groups: Pick<UserGroup, "id" | "title">[];
		};
	}> {
		return this.#http.request(
			"GET",
			`users/${encodeURIComponent(id)}/user-groups`,
			{ signal },
		);
	}

	/**
	 * Returns the user role of the user specified by the provided user id.
	 * Includes the assigned resources, if applicable (assigned course(s) for instructor role,
	 * assigned user group(s) for user group managers,
	 * assigned seat offering(s) for seat managers,
	 * assigned segment for reporter roles).
	 *
	 * @param id      - User id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getRole(id: string, signal?: AbortSignal): Promise<UserRole> {
		return this.#http.request(
			"GET",
			`users/${encodeURIComponent(id)}/user-role`,
			{ signal },
		);
	}

	/**
	 * Updates the role assigned to the user.
	 * The endpoint response is a User Group resource.
	 *
	 * @param id      - User id or email
	 * @param body    - New role and its assignments
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async updateRole(
		id: string,
		body: UserRoleModificationRequest,
		signal?: AbortSignal,
	): Promise<UserGroup> {
		return this.#http.request(
			"PUT",
			`users/${encodeURIComponent(id)}/user-role`,
			{ body, signal },
		);
	}
}

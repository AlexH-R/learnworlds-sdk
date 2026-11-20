import type { HttpClient } from "../../http.js";
import type { Paginated } from "../../types.js";
import type {
	CommunityCollection,
	CommunityPost,
	CommunityPostsRequest,
	CommunitySpace,
	CommunitySpaceCreationRequest,
	CommunitySpaceModificationRequest,
	CommunitySpacesRequest,
	CommunitySpaceUser,
} from "./community.model.js";

/**
 * Methods for the community endpoints (collections, spaces and posts).
 *
 * @example
 * ```ts
 * const lw = new LearnWorldsClient({ baseUrl, clientId, clientSecret });
 * const spaces = await lw.community.getSpaces();
 * ```
 */
export class CommunityResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with all the community collections of the school.
	 * The collections are in sorted order, with the oldest created collection appearing first.
	 *
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getCollections(
		signal?: AbortSignal,
	): Promise<{ data: CommunityCollection[] }> {
		return this.#http.request("GET", "community/collections", { signal });
	}

	/**
	 * Returns a list with all the community spaces of the school.
	 * The spaces are in sorted order, with the oldest created space appearing first,
	 * and the list is paginated.
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getSpaces(
		query?: CommunitySpacesRequest,
		signal?: AbortSignal,
	): Promise<Paginated<CommunitySpace>> {
		return this.#http.request("GET", "community/spaces", { query, signal });
	}

	/**
	 * Creates a new community space.
	 * `collectionId` is required for public and private spaces, and not allowed for standalone ones.
	 *
	 * @param body    - Space data
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async createSpace(
		body: CommunitySpaceCreationRequest,
		signal?: AbortSignal,
	): Promise<CommunitySpace> {
		return this.#http.request("POST", "community/spaces", { body, signal });
	}

	/**
	 * Returns the community space specified by the provided space id.
	 *
	 * @param id      - Space id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getSpace(id: string, signal?: AbortSignal): Promise<CommunitySpace> {
		return this.#http.request(
			"GET",
			`community/spaces/${encodeURIComponent(id)}`,
			{ signal },
		);
	}

	/**
	 * Updates the community space specified by the provided space id.
	 *
	 * @param id      - Space id
	 * @param body    - Fields to update
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async updateSpace(
		id: string,
		body: CommunitySpaceModificationRequest,
		signal?: AbortSignal,
	): Promise<CommunitySpace> {
		return this.#http.request(
			"PUT",
			`community/spaces/${encodeURIComponent(id)}`,
			{ body, signal },
		);
	}

	/**
	 * Deletes the community space specified by the provided space id.
	 *
	 * @param id      - Space id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async deleteSpace(id: string, signal?: AbortSignal): Promise<void> {
		return this.#http.request(
			"DELETE",
			`community/spaces/${encodeURIComponent(id)}`,
			{ signal },
		);
	}

	/**
	 * Returns the users of the community space specified by the provided space id.
	 * The users are in sorted order, with the oldest created user appearing first,
	 * and the list is paginated, with a default limit of 10 users per page.
	 *
	 * @param id      - Space id
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getSpaceUsers(
		id: string,
		query?: { page?: number; items_per_page?: number },
		signal?: AbortSignal,
	): Promise<Paginated<CommunitySpaceUser>> {
		return this.#http.request(
			"GET",
			`community/spaces/${encodeURIComponent(id)}/users`,
			{ query, signal },
		);
	}

	/**
	 * Adds or invites users to the community space specified by the provided space id.
	 * If the space has `is_invitation_required` set to true, users are sent an invitation to join;
	 * otherwise they are added directly.
	 * Only the affected users are returned: users already in the space are left out.
	 *
	 * @param id      - Space id
	 * @param body    - Ids of the users to add
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async addSpaceUsers(
		id: string,
		body: { uids: string[] },
		signal?: AbortSignal,
	): Promise<{
		data: {
			invitation: boolean;
			users: CommunitySpaceUser[];
		};
	}> {
		return this.#http.request(
			"POST",
			`community/spaces/${encodeURIComponent(id)}/users`,
			{ body, signal },
		);
	}

	/**
	 * Removes a user from the community space specified by the provided space id.
	 *
	 * @param id      - Space id
	 * @param userId  - User id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async removeSpaceUser(
		id: string,
		userId: string,
		signal?: AbortSignal,
	): Promise<void> {
		return this.#http.request(
			"DELETE",
			`community/spaces/${encodeURIComponent(id)}/users/${encodeURIComponent(userId)}`,
			{ signal },
		);
	}

	/**
	 * Returns a list with all the posts of the school community.
	 * The posts are in sorted order, with the most recently created post appearing first,
	 * and the list is paginated, with a default limit of 10 posts per page.
	 * When more than one query param is provided, all of them are applied (AND operator).
	 *
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getPosts(
		query?: CommunityPostsRequest,
		signal?: AbortSignal,
	): Promise<Paginated<CommunityPost>> {
		return this.#http.request("GET", "community/posts", { query, signal });
	}

	/**
	 * Returns the community post specified by the provided post id.
	 *
	 * @param id      - Post id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getPost(id: string, signal?: AbortSignal): Promise<CommunityPost> {
		return this.#http.request(
			"GET",
			`community/posts/${encodeURIComponent(id)}`,
			{ signal },
		);
	}
}

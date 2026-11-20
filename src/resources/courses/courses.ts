import type { HttpClient } from "../../http.js";
import type { Paginated } from "../../types.js";
import type {
	Course,
	CourseCreationRequest,
	CourseModificationRequest,
	CourseSectionCreationRequest,
	CourseContent,
	CourseGradesRequest,
	CourseGrades,
} from "./courses.model.js";
import type { User } from "../users/users.model.js";

/**
 * Methods for the course endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const courses = await lw.courses.getAll();
 * ```
 */
export class CoursesResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list of all courses of the school.
	 * Courses are sorted by creation date, newest first.
	 * The list is paginated (50 courses per page).
	 *
	 * @param query   - Optional filters.
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws {LearnWorldsError} If the request fails.
	 */
	async getAll(
		query?: {
			page?: number;
			access?: string[];
			categories?: string;
		},
		signal?: AbortSignal,
	): Promise<Paginated<Course>> {
		return this.#http.request("GET", "courses", { query, signal });
	}

	/**
	 * Creates a new course. The endpoint response is the created Course resource.
	 *
	 * @param body    - Data for the course to create.
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws {LearnWorldsError} If the request fails.
	 */
	async create(
		body: CourseCreationRequest,
		signal?: AbortSignal,
	): Promise<Course> {
		return this.#http.request("POST", "courses", { body, signal });
	}

	/**
	 * Returns information about the course specified by the provided course ID.
	 *
	 * @param id      - ID of the course.
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws {LearnWorldsError} If the request fails or the course does not exist.
	 */
	async get(id: string, signal?: AbortSignal): Promise<Course> {
		return this.#http.request("GET", `courses/${encodeURIComponent(id)}`, {
			signal,
		});
	}

	/**
	 * Updates the course specified by the provided course ID.
	 * The endpoint response is the updated Course resource.
	 *
	 * @param id      - ID of the course to update.
	 * @param body    - Fields to update.
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws {LearnWorldsError} If the request fails or the course does not exist.
	 */
	async update(
		id: string,
		body: CourseModificationRequest,
		signal?: AbortSignal,
	): Promise<Course> {
		return this.#http.request("PUT", `courses/${encodeURIComponent(id)}`, {
			body,
			signal,
		});
	}

	/**
	 * Retrieves all the users enrolled in the course specified by the provided course ID.
	 * Users are sorted by creation date, newest first.
	 * The list is paginated (20 users per page by default).
	 *
	 * @param id      - ID of the course.
	 * @param query   - Optional filters.
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws {LearnWorldsError} If the request fails or the course does not exist.
	 */
	async getUsers(
		id: string,
		query?: {
			page?: number;
			include_suspended?: boolean;
			items_per_page?: number;
		},
		signal?: AbortSignal,
	): Promise<Paginated<User>> {
		return this.#http.request(
			"GET",
			`courses/${encodeURIComponent(id)}/users`,
			{ query, signal },
		);
	}

	/**
	 * Creates a new section in the given course.
	 * The endpoint response is the course contents, including the newly created section.
	 *
	 * @param id      - ID of the course to add the section to.
	 * @param body    - Data for the new section.
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws {LearnWorldsError} If the request fails or the course does not exist.
	 */
	async createSection(
		id: string,
		body: CourseSectionCreationRequest,
		signal?: AbortSignal,
	): Promise<CourseContent> {
		return this.#http.request(
			"POST",
			`courses/${encodeURIComponent(id)}/sections`,
			{ body, signal },
		);
	}

	/**
	 * Returns the contents of the course specified by the provided course ID.
	 * Includes sections and learning activities.
	 *
	 * @param id      - ID of the course.
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws {LearnWorldsError} If the request fails or the course does not exist.
	 */
	async getContents(id: string, signal?: AbortSignal): Promise<CourseContent> {
		return this.#http.request(
			"GET",
			`courses/${encodeURIComponent(id)}/contents`,
			{ signal },
		);
	}

	/**
	 * Retrieves the grades of all enrolled users in the course specified by the provided course ID.
	 * The list is paginated (20 grades per page).
	 *
	 * @param id      - ID of the course.
	 * @param query   - Optional filters.
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws {LearnWorldsError} If the request fails or the course does not exist.
	 */
	async getGrades(
		id: string,
		query?: CourseGradesRequest,
		signal?: AbortSignal,
	): Promise<Paginated<CourseGrades>> {
		return this.#http.request(
			"GET",
			`courses/${encodeURIComponent(id)}/grades`,
			{ query, signal },
		);
	}
}

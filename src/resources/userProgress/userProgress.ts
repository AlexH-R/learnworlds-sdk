import type { HttpClient } from "../../http.js";
import type { AsyncTask } from "../asynchronousActions/asynchronousActions.model.js";
import type {
	CourseCompletionRequest,
	CourseProgressResetRequest,
} from "./userProgress.model.js";

/**
 * Methods for the user progress endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const task = await lw.userProgress.complete("user_id", "course_id", {
 * 	send_course_complete_email: false,
 * 	units: [],
 * });
 * ```
 */
export class UserProgressResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Marks the user's progress on a course, or on specific learning activities, as complete.
	 * Pass an empty `units` array to complete the whole course.
	 *
	 * @param id        - User id or email
	 * @param courseId  - Course id
	 * @param body      - Units to complete and whether to send the completion email
	 * @param signal    - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async complete(
		id: string,
		courseId: string,
		body: CourseCompletionRequest,
		signal?: AbortSignal,
	): Promise<AsyncTask> {
		return this.#http.request(
			"POST",
			`users/${encodeURIComponent(id)}/courses/${encodeURIComponent(courseId)}/complete`,
			{ body, signal },
		);
	}

	/**
	 * Resets the user's progress on a course, or on specific learning activities.
	 * Pass an empty `units` array to reset the whole course.
	 *
	 * @param id        - User id or email
	 * @param courseId  - Course id
	 * @param body      - Units to reset
	 * @param signal    - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async reset(
		id: string,
		courseId: string,
		body: CourseProgressResetRequest,
		signal?: AbortSignal,
	): Promise<AsyncTask> {
		return this.#http.request(
			"POST",
			`users/${encodeURIComponent(id)}/courses/${encodeURIComponent(courseId)}/reset`,
			{ body, signal },
		);
	}
}

import type { HttpClient } from "../../http.js";
import type {
	CourseAnalytics,
	LearningActivityAnalytics,
	UserProgress,
	UserProgressPerCourse,
} from "./reporting.model.js";

/**
 * Methods for the reporting endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorldsClient({ baseUrl, clientId, clientSecret });
 * const analytics = await lw.reporting.getCourseAnalytics("course-id");
 * ```
 *
 */
export class ReportingResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns analytics about the course specified by the provided course id.
	 *
	 * @param id      - Course id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getCourseAnalytics(
		id: string,
		signal?: AbortSignal,
	): Promise<CourseAnalytics> {
		return this.#http.request(
			"GET",
			`courses/${encodeURIComponent(id)}/analytics`,
			{ signal },
		);
	}

	/**
	 * Returns analytics about a learning activity of a
	 * course specified by the provided course id and learning activity id.
	 *
	 * @param id      - Course id
	 * @param unitId  - Learning activity id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getLearningActivityAnalytics(
		id: string,
		unitId: string,
		signal?: AbortSignal,
	): Promise<LearningActivityAnalytics> {
		return this.#http.request(
			"GET",
			`courses/${encodeURIComponent(id)}/units/${encodeURIComponent(unitId)}/analytics`,
			{ signal },
		);
	}

	/**
	 * Returns information about the user progress for the user and course specified by the provided user id and course id.
	 * The result also includes the breakdown of user progress data per learning activity.
	 *
	 * @param id        - User id or email
	 * @param courseId  - Course id
	 * @param signal    - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getUserProgressPerCourse(
		id: string,
		courseId: string,
		signal?: AbortSignal,
	): Promise<UserProgressPerCourse> {
		return this.#http.request(
			"GET",
			`users/${encodeURIComponent(id)}/courses/${encodeURIComponent(courseId)}/progress`,
			{ signal },
		);
	}

	/**
	 * Returns information about the user progress, for the user specified by the provided user id, for all courses the user is enrolled in.
	 * The result also includes the breakdown of user progress data per learning activity. The list is paginated, with a default limit of 20 course progress data per page.
	 *
	 * @param id      - User id or email
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getUserProgress(
		id: string,
		signal?: AbortSignal,
	): Promise<UserProgress> {
		return this.#http.request(
			"GET",
			`users/${encodeURIComponent(id)}/progress`,
			{ signal },
		);
	}
}

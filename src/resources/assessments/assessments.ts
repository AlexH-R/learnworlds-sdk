import type { HttpClient } from "../../http.js";
import type { Paginated } from "../../types.js";
import type {
	AssessmentResponse,
	AssessmentResponseReviewRequest,
	AssessmentResponsesRequest,
	FormResponsesRequest,
} from "./assessments.model.js";

/**
 * Methods for the assessments endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorldsClient({ baseUrl, clientId, clientSecret });
 * const responses = await lw.assessments.getResponses("assessment_id");
 * ```
 */
export class AssessmentsResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns all the responses submitted in the assessment specified by the provided assessment id.
	 * The most recent submission appears first, and the list is paginated,
	 * with a limit of 20 responses per page.
	 *
	 * @param id      - Assessment id
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getResponses(
		id: string,
		query?: AssessmentResponsesRequest,
		signal?: AbortSignal,
	): Promise<Paginated<AssessmentResponse>> {
		return this.#http.request(
			"GET",
			`assessments/${encodeURIComponent(id)}/responses`,
			{ query, signal },
		);
	}

	/**
	 * Returns all the responses submitted in the form specified by the provided form id.
	 * The most recent submission appears first, and the list is paginated,
	 * with a limit of 20 responses per page.
	 *
	 * @param id      - Form id
	 * @param query   - Optional filters
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getFormResponses(
		id: string,
		query?: FormResponsesRequest,
		signal?: AbortSignal,
	): Promise<Paginated<AssessmentResponse>> {
		return this.#http.request(
			"GET",
			`forms/${encodeURIComponent(id)}/responses`,
			{
				query,
				signal,
			},
		);
	}

	/**
	 * Reviews the assessment submission specified by the provided submission id.
	 * Updates the grade and feedback of each delivered question and recalculates the submission grade.
	 *
	 * @param responseId  - Submission id (the `id` of an `AssessmentResponse`)
	 * @param body        - Grades and feedback to set
	 * @param signal      - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async reviewResponse(
		responseId: string,
		body: AssessmentResponseReviewRequest,
		signal?: AbortSignal,
	): Promise<AssessmentResponse & { user_id: string; email: string }> {
		return this.#http.request(
			"POST",
			`assessments/scores/${encodeURIComponent(responseId)}/review`,
			{ body, signal },
		);
	}
}

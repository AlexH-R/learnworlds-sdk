import type { HttpClient } from "../../http.js";
import type { Paginated } from "../../types.js";
import type {
	Certificate,
	CertificateModificationRequest,
	CertificatesRequest,
} from "./certificates.model.js";

/**
 * Methods for the certificates endpoints.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * const certificates = await lw.certificates.getAll({ user_id: "user_id" });
 * ```
 */
export class CertificatesResource {
	#http: HttpClient;

	constructor(http: HttpClient) {
		this.#http = http;
	}

	/**
	 * Returns a list with certificates.
	 * The certificates are in sorted order, with the most recently created certificate appearing first,
	 * and the list is paginated, with a limit of 20 certificates per page.
	 * When more than one query param is provided, all of them are applied (AND operator).
	 * At least one of user_id or course_id is required.
	 *
	 * @param query   - Filters (user_id or course_id is required)
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async getAll(
		query: CertificatesRequest,
		signal?: AbortSignal,
	): Promise<Paginated<Certificate>> {
		return this.#http.request("GET", "certificates", { query, signal });
	}

	/**
	 * Updates the certificate specified by the provided certificate id.
	 * At least one of issued, expires_on or form is required.
	 *
	 * Setting expires_on also recalculates the certificate status: an active or expired certificate
	 * becomes expired when the new date is in the past and active when it is in the future.
	 * Expiration reminders, the "Certificate expired" automation trigger and any retraining cycle
	 * based on the expiration are rescheduled to the new date.
	 * A revoked certificate keeps its revoked status; only its dates change.
	 *
	 * @param id      - Certificate id
	 * @param body    - Fields to update
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async update(
		id: string,
		body: CertificateModificationRequest,
		signal?: AbortSignal,
	): Promise<Certificate> {
		return this.#http.request("PUT", `certificates/${encodeURIComponent(id)}`, {
			body,
			signal,
		});
	}

	/**
	 * Revokes the certificate specified by the provided certificate id.
	 * The certificate is kept with status revoked and is still returned by `getAll`
	 * (filter with `status: "revoked"`). Revocation is permanent.
	 * Revoking fires the "Certificate revoked" automation trigger.
	 *
	 * Certificates issued through Credly are also revoked on Credly; the Credly integration
	 * must be connected, otherwise the request fails and the certificate is left unchanged.
	 * Certificates issued through other external providers (e.g. Accredible) cannot be revoked.
	 *
	 * @param id      - Certificate id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async revoke(id: string, signal?: AbortSignal): Promise<void> {
		return this.#http.request(
			"PUT",
			`certificates/${encodeURIComponent(id)}/revoke`,
			{ signal },
		);
	}

	/**
	 * Deletes the certificate specified by the provided certificate id.
	 * A deleted certificate is no longer returned by the API.
	 * To invalidate a certificate while keeping it on record, use `revoke` instead.
	 *
	 * @param id      - Certificate id
	 * @param signal  - AbortSignal to stop the request at any time.
	 * @throws { LearnWorldsError }
	 */
	async delete(id: string, signal?: AbortSignal): Promise<void> {
		return this.#http.request(
			"DELETE",
			`certificates/${encodeURIComponent(id)}`,
			{
				signal,
			},
		);
	}
}

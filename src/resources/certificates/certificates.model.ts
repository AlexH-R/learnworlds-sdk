export interface Certificate {
	id: string;
	title: string;
	issued: number;
	attempts: number;
	type: "completion" | "certificate";
	status: "active" | "expired" | "revoked";
	score: string;
	short_url: string | null;
	provider: "LearnWorlds" | "Accredible" | "Credly";
	external_url: string | null;
	expires_on: number | null;
	form: {
		firstname: string;
		lastname: string;
		ptin: string;
	} | null;
	user: {
		id: string;
		email: string;
	};
	course_id: string;
}
export type CertificatesRequest = {
	page?: number;
	course_id?: string;
	include_suspended?: boolean;
	status?: "active" | "expired" | "revoked";
	user_id?: string;
} & ({ user_id: string } | { course_id: string });
export interface CertificateModificationRequest {
	issued?: number;
	expires_on?: number;
	form?: {
		firstname: string;
		lastname: string;
		ptin: string;
	};
}

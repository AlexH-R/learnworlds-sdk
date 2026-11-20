export interface AssessmentResponse {
	id: string;
	user_id: string | null;
	email: string | null;
	grade: number | null;
	passed: boolean | null;
	created: number;
	modified: number;
	submittedTimestamp: number;
	answers: {
		blockId: string;
		blockType: string;
		description: string;
		answer: string;
		points: number | null;
		blockMaxScore: number | null;
		answerData:
			| {
					downloads: {
						title: string;
						url: string;
						avStatus: "safe" | "unsafe" | "scan_failed" | "awating_scan";
					}[];
			  }[]
			| null;
		feedback: string | null;
	}[];
	generalFeedback: string | null;
}

export type AssessmentResponsesRequest = {
	page?: number;
	include_suspended?: boolean;
	items_per_page?: number;
	users?: string;
};

export type FormResponsesRequest = AssessmentResponsesRequest;

export interface AssessmentResponseReviewRequest {
	answers: {
		blockId: string;
		grade: number;
		feedback: string;
	}[];
	generalFeedback: string;
}

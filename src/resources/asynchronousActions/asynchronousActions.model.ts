export interface AsyncTask {
	async: boolean;
	job_id: string;
}

export interface AsyncTaskStatus {
	action?: string;
	state: "in-progress" | "failed" | "completed";
	errors?: Record<string, unknown>[];
	results?: Record<string, unknown> | null;
}

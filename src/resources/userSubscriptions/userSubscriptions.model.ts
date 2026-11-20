export interface UserSubscription {
	user_id: string;
	email: string;
	plan_id: string;
	created: number | null;
	expires_at: number | null;
	status: "active" | "inactive" | "trial";
	provider: "learnworlds" | "stripe";
	provider_meta: {
		id: string;
		customer_id: string;
		plan: string;
		trial_start: number | null;
		trial_end: number | null;
		current_period_start: number;
		current_period_end: number;
	} | null;
}

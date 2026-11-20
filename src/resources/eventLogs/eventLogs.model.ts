export interface EventLog {
	user: {
		id: string;
		username: string;
	};
	created: number;
	activity:
		| "register"
		| "login"
		| "logout"
		| "purchase"
		| "manual_enrollment"
		| "drip_feed_section_unlocked"
		| "subscription_signup"
		| "subscription_trial"
		| "subscription_trial_expired"
		| "subscription_changed"
		| "subscription_renewal"
		| "subscription_cancelled"
		| "subscription_scheduled_cancellation"
		| "subscription_reactivated"
		| "failed_purchase"
		| "new_affiliate"
		| "new_affiliate_manual"
		| "affiliate_deactivated"
		| "affiliate_payout"
		| "follow"
		| "post"
		| "post_comment"
		| "post_like"
		| "award_certificate"
		| "visit_course"
		| "complete_course"
		| "installment_paid"
		| "payment_plan_completed"
		| "payment_plan_canceled"
		| "payment_failed"
		| "sca_related_events"
		| "session_scheduled"
		| "session_attended"
		| "session_manually_attended"
		| "group_session_scheduled"
		| "group_session_attended"
		| "group_session_manually_attended";
	description: string;
	type: "award" | "purchase" | "social" | "user";
	additional_info: Record<string, unknown> | null;
}

export type EventLogsRequest = {
	page?: number;
	activity?:
		| "register"
		| "login"
		| "logout"
		| "purchase"
		| "manual_enrollment"
		| "drip_feed_section_unlocked"
		| "subscription_signup"
		| "subscription_trial"
		| "subscription_trial_expired"
		| "subscription_changed"
		| "subscription_renewal"
		| "subscription_cancelled"
		| "subscription_scheduled_cancellation"
		| "subscription_reactivated"
		| "failed_purchase"
		| "new_affiliate"
		| "new_affiliate_manual"
		| "affiliate_deactivated"
		| "affiliate_payout"
		| "follow"
		| "post"
		| "post_comment"
		| "post_like"
		| "award_certificate"
		| "visit_course"
		| "complete_course"
		| "installment_paid"
		| "payment_plan_completed"
		| "payment_plan_canceled"
		| "payment_failed"
		| "sca_related_events"
		| "session_scheduled"
		| "session_attended"
		| "session_manually_attended"
		| "group_session_scheduled"
		| "group_session_attended"
		| "group_session_manually_attended";
	created_after?: number;
	created_before?: number;
	sort?: "asc" | "desc";
	user_id?: string;
};

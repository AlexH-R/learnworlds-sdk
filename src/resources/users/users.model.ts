import type { Course } from "../courses/courses.model.js";

export interface User {
	id: string;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	subscribed_for_marketing_emails: boolean | null;
	eu_customer: boolean | null;
	is_admin: boolean;
	is_instructor: boolean;
	is_suspended: boolean;
	is_reporter: boolean;
	role: {
		level:
			| "admin"
			| "instructor"
			| "reporter"
			| "seat_manager"
			| "license_reporter"
			| "user";
		name: string;
	};
	is_affiliate: boolean;
	referrer_id: string | null;
	last_login: number | null;
	signup_approval_status: "passed" | "failed" | "pending";
	created: number;
	fields: {
		bio: string | null;
		location: string | null;
		url: string | null;
		fb: string | null;
		twitter: string | null;
		instagram: string | null;
		linkedin: string | null;
		skype: string | null;
		behance: string | null;
		dribbble: string | null;
		github: string | null;
		phone: string;
		address: string;
		country: string;
		birthday: string;
		company: string;
		company_size: string;
		university: string;
		graduation_year: string;
	};
	tags: string[];
	utms: {
		fc_utm_source: string | null;
		fc_utm_medium: string | null;
		fc_utm_campaign: string | null;
		fc_utm_term: string | null;
		fc_utm_content: string | null;
		fc_landing: string | null;
		fc_referrer: string | null;
		fc_country: string | null;
		lc_utm_source: string | null;
		lc_utm_medium: string | null;
		lc_utm_campaign: string | null;
		lc_utm_term: string | null;
		lc_utm_content: string | null;
		lc_landing: string | null;
		lc_referrer: string | null;
		lc_country: string | null;
	};
	billing_info: Record<string, unknown> | null;
	nps_score: number | null;
	nps_comment: string | null;
}
export interface UserCreationRequest {
	email: string;
	username: string;
	password?: string;
	subscribed_for_marketing_emails?: boolean | null;
	send_registration_email?: boolean | null;
	is_admin?: boolean;
	signup_validation_rules?: boolean;
	fields?: {
		bio?: string;
		location?: string;
		url?: string;
		fb?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
		skype?: string;
		behance?: string;
		dribbble?: string;
		github?: string;
		phone?: string;
		address?: string;
		country?: string;
		birthday?: string;
		company?: string;
		company_size?: string;
		university?: string;
		graduation_year?: string;
	};
	tags?: string[];
	utms?: {
		fc_utm_source?: string;
		fc_utm_medium?: string;
		fc_utm_campaign?: string;
		fc_utm_term?: string;
		fc_utm_content?: string;
		fc_landing?: string;
		fc_referrer?: string;
		fc_country?: string;
		lc_utm_source?: string;
		lc_utm_medium?: string;
		lc_utm_campaign?: string;
		lc_utm_term?: string;
		lc_utm_content?: string;
		lc_landing?: string;
		lc_referrer?: string;
		lc_country?: string;
	};
}
export interface UserModificationRequest {
	email?: string;
	username?: string;
	subscribed_for_marketing_emails?: boolean | null;
	is_admin?: boolean;
	signup_validation_rules?: boolean;
	fields?: {
		bio?: string;
		location?: string;
		url?: string;
		fb?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
		skype?: string;
		behance?: string;
		dribbble?: string;
		github?: string;
		phone?: string;
		address?: string;
		country?: string;
		birthday?: string;
		company?: string;
		company_size?: string;
		university?: string;
		graduation_year?: string;
	};
	tags?: string[];
	utms?: {
		fc_utm_source?: string;
		fc_utm_medium?: string;
		fc_utm_campaign?: string;
		fc_utm_term?: string;
		fc_utm_content?: string;
		fc_landing?: string;
		fc_referrer?: string;
		fc_country?: string;
		lc_utm_source?: string;
		lc_utm_medium?: string;
		lc_utm_campaign?: string;
		lc_utm_term?: string;
		lc_utm_content?: string;
		lc_landing?: string;
		lc_referrer?: string;
		lc_country?: string;
	};
}
export interface Enrollment {
	created: number;
	expires: number | null;
	due_date: number | null;
	original_price: number | null;
	discount_price: number | null;
	final_price: number | null;
	type: "one_off" | "subscription" | "installment" | null;
	interval: number | null;
	intervalType: "day" | "week" | "month" | "year" | null;
	course: Course;
}
export interface EnrollmentCreationRequest {
	productId: string;
	productType: "course" | "bundle" | "subscription";
	justification?: string | null;
	price: number;
	duration_type?: "months" | "weeks" | "days";
	duration?: number;
	send_enrollment_email?: boolean | null;
}
export interface EnrollmentDeletionRequest {
	productId: string;
	productType: "course" | "bundle" | "subscription";
}
export interface Product {
	id: string;
	title: string;
	type: "course" | "bundle" | "subscription";
}
export interface Segment {
	id: string;
	name: string;
	description: string | null;
}
export interface UserSeatOffering {
	id: string;
	title: string;
	active: boolean;
	got_seat_on: number;
}
export interface UserRole {
	id: string;
	email: string;
	username: string;
	role_id: string;
	user_role: {
		id: string;
		access_level: string;
		name: string;
	};
	assigned_courses: {
		course_id: string;
		revenue_share_percentage: number;
	}[];
	assigned_seat_offering_ids: string[];
	assigned_user_group_ids: string[];
	assigned_segment_id: string;
	assigned_licenses_ids: string[];
}
export interface UserRoleModificationRequest {
	role_id: string;
	assigned_courses?: {
		course_id: string;
		revenue_share_percentage: number;
	}[];
	assigned_seat_offering_ids?: string[];
	assigned_user_group_ids?: string[];
	assigned_segment_id?: string;
}

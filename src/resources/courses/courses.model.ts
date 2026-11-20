export interface Course {
	id: string;
	title: string;
	expires: number | null;
	expiresType: "days" | "weeks" | "months";
	afterPurchase: {
		navigationType: "global" | "custom";
		type: "thankyou" | "pathplayer" | "course" | "afterlogin" | "page" | "url";
		settings: {
			url: string | null;
			page: string | null;
		};
	} | null;
	categories: string[];
	description: string | null;
	label: string | null;
	author: {
		name: string;
		image: string | null;
	} | null;
	courseImage: string | null;
	original_price: number;
	discount_price: number;
	final_price: number;
	dripFeed: "date" | "days" | "none";
	identifiers: {
		google_store_id: string;
		apple_store_id: string;
		slug: string;
	};
	taxSettings:
		| {
				taxExemptionMode: "exempt";
				taxExemptionRegulationReference: string;
		  }
		| {
				taxExemptionMode: "school_default";
				taxExemptionRegulationReference: string | null;
		  }
		| null;
	access:
		| "paid"
		| "free"
		| "coming_soon"
		| "enrollment_closed"
		| "private"
		| "draft";
	created: number;
	modified: number;
}
export type CourseCreationRequest = {
	titleId: string;
	title: string;
	description?: string;
	price?: number;
	dripFeed?: Course["dripFeed"];
	access: "paid" | "free" | "coming_soon" | "private" | "draft";
	categories?: string[];
	label?: string;
	taxSettings?: Course["taxSettings"];
};
export type CourseModificationRequest = Partial<
	Omit<CourseCreationRequest, "titleId">
>;

export interface CourseSection {
	title: string;
	description: string;
	access: "public" | "premium" | "soon" | "private";
	drip: {
		days: number;
		date: number;
		notify: boolean;
		subject: string;
		body: string;
	} | null;
	learningUnits: {
		type: string;
		id: string;
		icon: string;
		title: string;
		subtitle: string;
	}[];
}
export type CourseSectionCreationRequest = {
	title: string;
	description?: string;
	access: "draft" | "soon" | "free" | "paid";
	drip?: {
		days?: number;
		date?: number;
		notify?: boolean;
		subject?: string;
		body?: string;
	} | null;
};
export type CourseContent = Pick<Course, "id" | "title"> & {
	sections: CourseSection[];
};

export type CourseGrades = {
	id: string;
	user_id: string;
	email: string;
	grade: number;
	created: number;
	modified: number;
	submittedTimestamp: number;
	learningUnit: {
		id: string;
		type: string;
		icon: string;
		subtitle: string;
	};
};
export type CourseGradesRequest = {
	page?: number;
	items_per_page?: number;
	learningUnits?: number;
	order?: "asc" | "desc";
	sort?: "created" | "submittedTimestamp";
	users?: string;
};

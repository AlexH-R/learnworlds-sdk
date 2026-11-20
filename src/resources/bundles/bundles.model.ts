export interface Bundle {
	id: string;
	title: string;
	products: {
		courses: string[];
	};
	image: string | null;
	description: string | null;
	access: "draft" | "public";
	created: number;
	modified: number;
	afterPurchase: {
		navigationType: string;
		type: "thankyou" | "pathplayer" | "course" | "afterlogin" | "page" | "url";
		settings: {
			url: string | null;
			page: string | null;
		};
	};
	price: number;
	paymentPlans: {
		name: string;
		description: string | null;
		type: "with_upfront" | "without_upfront";
		order: number;
		firstAmount: number;
		amount: number;
		paymentsCount: number;
		subscriptionTrialType: "default" | "days" | "date";
		subscriptionIntervalType:
			| "7-day"
			| "14-day"
			| "15-day"
			| "42-day"
			| "1-month"
			| "2-month"
			| "3-month"
			| "6-month";
		status: "private" | "public" | "hidden" | "archived" | "deleted";
		isCancelable: boolean;
		validFrom: number | null;
		validTo: number | null;
		subscriptionTrialDays: number | null;
		subscriptionTrialDate: number | null;
		nameOverride: boolean;
		paymentPlanNameOverride: string | null;
		id: string;
	}[];
	taxSettings: {
		taxExemptionMode: "school_default" | "exempt";
		taxExemptionRegulationReference: string | null;
	} | null;
}

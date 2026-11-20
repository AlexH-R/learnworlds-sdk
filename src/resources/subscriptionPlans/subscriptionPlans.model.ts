export interface SubscriptionPlan {
	id: string;
	title: string;
	stripePlanId: string;
	description: string | null;
	products: {
		courses: string[];
	};
	image: string | null;
	interval: number;
	interval_type: "day" | "week" | "month";
	trial_period_days: number;
	afterPurchase: {
		navigationType: "global" | "custom";
		type: "thankyou" | "pathplayer" | "course" | "afterlogin" | "page" | "url";
		settings: {
			url: string | null;
			page: string | null;
		};
	};
	access: "private" | "public" | "soon" | "view-locked";
	created: number;
	modified: number;
	price: number;
}

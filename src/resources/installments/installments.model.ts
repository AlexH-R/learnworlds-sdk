export interface Installment {
	user_id: string;
	email: string;
	id: string;
	plan_id: string;
	productId: string;
	productType: "course" | "bundle";
	ends_at: number | null;
	current_period_start: number;
	current_period_end: number;
	name: string;
	type: "with_upfront" | "without_upfront";
	status: "active" | (string & {});
	firstAmount: number;
	amount: number;
	paymentsCount: number;
	paymentsPayed: number;
	isCancelable: boolean;
	installmentIntervalType:
		| "1-month"
		| "2-month"
		| "3-month"
		| "6-month"
		| "7-day"
		| "14-day"
		| "15-day"
		| "42-day";
	firstInstallmentType: "default" | "days" | "date";
	firstInstallmentlDays: number;
	firstInstallmentDate: number | null;
}

export interface Payment {
	id: string;
	transaction_id: string;
	type: "subscription" | "installment" | "one-off";
	product: {
		id: string;
		type: "course" | "bundle" | "subscription";
		name: string;
		description: string | null;
		image: string | null;
		trial_days: number;
		original_price: number;
		discount_price: number;
		final_price: number;
	};
	price: number;
	discount: number;
	refund_at: number | null;
	user_id: string;
	paid_at: number | null;
	invoice: string | null;
	billing_info: Record<string, unknown> | null;
	coupon: string | null;
	instructors: {
		id: string;
		percentage: number | null;
	}[];
	instructors_total_percentage: number | null;
	tax_amount: number;
	tax_percentage: number;
	affiliate: {
		id: string;
		username: string;
		code: string;
		commission_percentage: number;
		commission_amount: number;
		payment_status: "new" | "approved" | "mature" | "paid" | "rejected";
	} | null;
	period: string | null;
	payment_plan_current_payment: number | null;
	payment_plan_total_payments: number | null;
	gateway: string | null;
	created: number;
}
export type PaymentsRequest = {
	page?: number;
	affiliate_id?: string;
	created_after?: number;
	created_before?: number;
	items_per_page?: number;
	product_id?: string;
	product_type?: "course" | "bundle" | "subscription";
	user_id?: string;
};
export interface Invoice {
	invoice: string;
	url: string;
	expires_at: number;
}

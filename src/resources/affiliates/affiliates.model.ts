import type { Payment } from "../payments/payments.model.js";

export interface Affiliate {
	id: string;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	code: string;
	paymentMethod: "paypal" | "other" | "none" | "bank_transfer";
	paymentNotes: string | null;
	date: number;
	clicks: number;
	sales: number;
	commissions: number;
	leads: number;
	customers: number;
	payouts: number;
	pending: number;
	due: number;
	commission_percentage: number;
}
export interface AffiliateCreationRequest {
	commission_percentage?: number;
	paymentMethod?: "paypal" | "other" | "bank_transfer" | "none";
	paymentNotes?: string | null;
}
export interface PendingPayout {
	affiliateId: string;
	amount: number;
	paymentMethod: string | null;
	paymentNotes: string | null;
}
export interface Payout {
	id: string;
	amount: number;
	paymentMethod: string | null;
	paymentNotes: string | null;
	created: number;
	payments: Payment[];
	completedBy: {
		id: string;
		username: string;
	};
}

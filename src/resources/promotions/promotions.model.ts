import type { Payment } from "../payments/payments.model.js";

export interface Coupon {
	code: string;
	quantity: number | null;
	expires: string | null;
	bulk: boolean;
	prefix: string | null;
	times_used: number;
}
export interface CouponCreationRequest {
	code: string;
	quantity?: number;
	expires?: string;
}
export interface BulkCouponCreationRequest {
	prefix: string;
	quantity: number;
	expires?: string | null;
}
export interface CouponUsage {
	usage: Coupon;
	payments: Payment[];
}
export interface Promotion {
	id: string;
	name: string;
	coupons: Coupon[];
	applies_to_all: ("bundles" | "courses" | "courses_bundles" | "none")[];
	products: {
		type: "course" | "bundle" | "subscription";
		id: string;
	}[];
	type: "percentage" | "fixed" | "flat";
	value: number;
	created: number;
	modified: number;
}
export interface PromotionCreationRequest {
	name: string;
	type?: "percentage" | "fixed" | "flat";
	value?: number;
	applies_to_all?: ("bundles" | "courses" | "courses_bundles" | "none")[];
	products?: {
		type: "course" | "bundle";
		id: string;
	}[];
}

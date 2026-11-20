export interface Lead {
	email: string;
	first_name: string;
	last_name: string;
	tags: string[];
	subscribed_for_marketing_emails: boolean | null;
	eu_customer: boolean | null;
	created: number;
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
	page_submitted: string | null;
	user_registered_at: number | null;
	user_id: string | null;
	submissions: {
		first_name: string;
		last_name: string;
		tags: string[];
		subscribed_for_marketing_emails: boolean;
		eu_customer: boolean;
		created: number;
		utms: Lead["utms"];
		page_submitted: string | null;
	}[];
}

export interface SeatOfferingCreationRequest {
	title: string;
	description?: string;
	products:
		| { courses: string[]; learning_programs?: string[] }
		| { courses?: string[]; learning_programs: string[] };
	number_of_seats: number;
	max_number_of_users?: number;
	seat_managers?: string[];
	tags?: string[];
	access?: "active" | "inactive";
}

export interface SeatOffering {
	id: string;
	title: string;
	description: string;
	products: {
		courses: string[];
		learning_programs: string[];
	};
	number_of_seats: number;
	available_seats: number;
	max_number_of_users: number | null;
	seat_managers: {
		id: string;
		username: string;
		email: string;
		role_id: string;
	}[];
	tags: string[];
	total_enrollments: number;
	access: "active" | "inactive";
	created: number;
	modified: number;
}

export interface SeatOfferingModificationRequest {
	title: string;
	description?: string;
	products?: {
		courses?: string[];
		learning_programs?: string[];
	};
	number_of_seats: number;
	max_number_of_users?: number;
	seat_managers?: string[];
	tags?: string[];
	access?: "active" | "inactive";
}

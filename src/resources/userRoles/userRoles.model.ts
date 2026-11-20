export interface Role {
	id: string;
	title: string;
	description: string;
	access_level:
		| "admin"
		| "instructor"
		| "reporter"
		| "seat_manager"
		| "user"
		| "license_reporter";
	custom_role: boolean;
}

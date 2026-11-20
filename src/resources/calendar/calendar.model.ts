export interface SchoolEvent {
	title: string;
	startDate: number;
	productId: string;
	type: "dripFeed" | "fileAssignment" | "liveSession";
	bookingDetails: {
		learnerUserId: string;
		hostUserId: string;
		status: "scheduled" | (string & {});
		type: "oneOnOne" | "group";
		providerName: string;
		providerData: Record<string, unknown>;
	} | null;
}

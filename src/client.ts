import { LearnWorldsError } from "./errors.js";
import { HttpClient, type FetchFn } from "./http.js";
import { AffiliatesResource } from "./resources/affiliates/affiliates.js";
import { AssessmentsResource } from "./resources/assessments/assessments.js";
import { AsynchronousActionsResource } from "./resources/asynchronousActions/asynchronousActions.js";
import { BundlesResource } from "./resources/bundles/bundles.js";
import { CalendarResource } from "./resources/calendar/calendar.js";
import { CertificatesResource } from "./resources/certificates/certificates.js";
import { CommunityResource } from "./resources/community/community.js";
import { CoursesResource } from "./resources/courses/courses.js";
import { EventLogsResource } from "./resources/eventLogs/eventLogs.js";
import { InstallmentsResource } from "./resources/installments/installments.js";
import { LeadsResource } from "./resources/leads/leads.js";
import { PaymentsResource } from "./resources/payments/payments.js";
import { PromotionsResource } from "./resources/promotions/promotions.js";
import { ReportingResource } from "./resources/reporting/reporting.js";
import { SeatsResource } from "./resources/seats/seats.js";
import { SubscriptionPlansResource } from "./resources/subscriptionPlans/subscriptionPlans.js";
import { UserGroupsResource } from "./resources/userGroups/userGroups.js";
import { UserProgressResource } from "./resources/userProgress/userProgress.js";
import { UserRolesResource } from "./resources/userRoles/userRoles.js";
import { UsersResource } from "./resources/users/users.js";
import { UserSubscriptionsResource } from "./resources/userSubscriptions/userSubscriptions.js";

export interface LearnWorldsConfig {
	baseUrl: string;
	clientId: string;
	clientSecret: string;
	/**
	 * Custom `fetch` implementation (tests, proxies, logging…).
	 * @defaultValue `globalThis.fetch`
	 */
	fetch?: FetchFn;
}

/**
 * LearnWorlds SDK client.
 *
 * @example
 * ```ts
 * const lw = new LearnWorlds({ baseUrl, clientId, clientSecret });
 * ```
 */
export class LearnWorlds {
	#http: HttpClient;
	courses: CoursesResource;
	reporting: ReportingResource;
	bundles: BundlesResource;
	subscriptionPlans: SubscriptionPlansResource;
	userSubscriptions: UserSubscriptionsResource;
	installments: InstallmentsResource;
	calendar: CalendarResource;
	users: UsersResource;
	payments: PaymentsResource;
	leads: LeadsResource;
	promotions: PromotionsResource;
	affiliates: AffiliatesResource;
	certificates: CertificatesResource;
	eventLogs: EventLogsResource;
	assessments: AssessmentsResource;
	userProgress: UserProgressResource;
	asynchronousActions: AsynchronousActionsResource;
	seats: SeatsResource;
	userGroups: UserGroupsResource;
	userRoles: UserRolesResource;
	community: CommunityResource;

	/**
	 * @throws {LearnWorldsError} If `baseUrl`, `clientId` or `clientSecret` are missing or invalid.
	 */
	constructor(learnWorldsConfig: LearnWorldsConfig) {
		const { baseUrl, clientId, clientSecret, fetch } = learnWorldsConfig;

		if (!baseUrl || !URL.canParse(baseUrl)) {
			throw new LearnWorldsError("baseUrl must be a valid URL");
		}
		if (!clientId || !clientSecret) {
			throw new LearnWorldsError("clientId and clientSecret are required");
		}

		this.#http = new HttpClient({
			baseUrl: baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
			clientId,
			clientSecret,
			fetch: fetch ?? ((input, init) => globalThis.fetch(input, init)),
		});
		this.courses = new CoursesResource(this.#http);
		this.reporting = new ReportingResource(this.#http);
		this.bundles = new BundlesResource(this.#http);
		this.subscriptionPlans = new SubscriptionPlansResource(this.#http);
		this.userSubscriptions = new UserSubscriptionsResource(this.#http);
		this.installments = new InstallmentsResource(this.#http);
		this.calendar = new CalendarResource(this.#http);
		this.users = new UsersResource(this.#http);
		this.payments = new PaymentsResource(this.#http);
		this.leads = new LeadsResource(this.#http);
		this.promotions = new PromotionsResource(this.#http);
		this.affiliates = new AffiliatesResource(this.#http);
		this.certificates = new CertificatesResource(this.#http);
		this.eventLogs = new EventLogsResource(this.#http);
		this.assessments = new AssessmentsResource(this.#http);
		this.userProgress = new UserProgressResource(this.#http);
		this.asynchronousActions = new AsynchronousActionsResource(this.#http);
		this.seats = new SeatsResource(this.#http);
		this.userGroups = new UserGroupsResource(this.#http);
		this.userRoles = new UserRolesResource(this.#http);
		this.community = new CommunityResource(this.#http);
	}
}

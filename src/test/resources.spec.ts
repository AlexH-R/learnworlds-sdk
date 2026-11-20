import { describe, expect, it, mock } from "bun:test";
import { LearnWorldsClient } from "../client.js";

type Call = (lw: LearnWorldsClient) => Promise<unknown>;

interface Case {
	name: string;
	call: Call;
	method: "POST" | "PUT" | "DELETE";
	path: string;
	body?: unknown;
}

const BASE = "/admin/api/v2/";
const ID = "a/b c";
const ENC = "a%2Fb%20c";
const UID = "u/1";
const UENC = "u%2F1";
const BODY = { sentinel: true } as never;

const createClient = (
	respond: () => Response = () => Response.json({ ok: true }),
) => {
	const fetchMock = mock(
		async (input: string | URL | Request, _init?: RequestInit) => {
			const url = new URL(String(input));
			if (url.pathname.includes("oauth2"))
				return Response.json({
					success: true,
					errors: [],
					tokenData: {
						access_token: "T",
						token_type: "Bearer",
						expires_in: 3600,
					},
				});
			return respond();
		},
	);
	const lw = new LearnWorldsClient({
		baseUrl: "https://school.com/admin/api",
		clientId: "cid",
		clientSecret: "secret",
		fetch: fetchMock as unknown as typeof fetch,
	});
	const lastRequest = () => {
		const [input, init] = fetchMock.mock.calls.at(-1) ?? [];
		return {
			url: new URL(String(input)),
			method: init?.method,
			headers: init?.headers as Record<string, string>,
			body: typeof init?.body === "string" ? JSON.parse(init.body) : init?.body,
		};
	};
	return { lw, fetchMock, lastRequest };
};

const cases: Case[] = [
	//** users
	{
		name: "users.create",
		call: (lw) => lw.users.create(BODY),
		method: "POST",
		path: "users",
		body: BODY,
	},
	{
		name: "users.update",
		call: (lw) => lw.users.update(ID, BODY),
		method: "PUT",
		path: `users/${ENC}`,
		body: BODY,
	},
	{
		name: "users.updateTags",
		call: (lw) => lw.users.updateTags(ID, { tags: ["x"], action: "attach" }),
		method: "PUT",
		path: `users/${ENC}/tags`,
		body: { tags: ["x"], action: "attach" },
	},
	{
		name: "users.enroll",
		call: (lw) => lw.users.enroll(ID, BODY),
		method: "POST",
		path: `users/${ENC}/enrollment`,
		body: BODY,
	},
	{
		name: "users.unenroll",
		call: (lw) => lw.users.unenroll(ID, BODY),
		method: "DELETE",
		path: `users/${ENC}/enrollment`,
		body: BODY,
	},
	{
		name: "users.suspend",
		call: (lw) => lw.users.suspend(ID),
		method: "PUT",
		path: `users/${ENC}/suspend`,
	},
	{
		name: "users.unsuspend",
		call: (lw) => lw.users.unsuspend(ID),
		method: "PUT",
		path: `users/${ENC}/unsuspend`,
	},
	{
		name: "users.updateRole",
		call: (lw) => lw.users.updateRole(ID, BODY),
		method: "PUT",
		path: `users/${ENC}/user-role`,
		body: BODY,
	},

	//** courses
	{
		name: "courses.create",
		call: (lw) => lw.courses.create(BODY),
		method: "POST",
		path: "courses",
		body: BODY,
	},
	{
		name: "courses.update",
		call: (lw) => lw.courses.update(ID, BODY),
		method: "PUT",
		path: `courses/${ENC}`,
		body: BODY,
	},
	{
		name: "courses.createSection",
		call: (lw) => lw.courses.createSection(ID, BODY),
		method: "POST",
		path: `courses/${ENC}/sections`,
		body: BODY,
	},

	//** promotions
	{
		name: "promotions.create",
		call: (lw) => lw.promotions.create(BODY),
		method: "POST",
		path: "promotions",
		body: BODY,
	},
	{
		name: "promotions.createCoupon",
		call: (lw) => lw.promotions.createCoupon(ID, BODY),
		method: "POST",
		path: `promotions/${ENC}/coupons`,
		body: BODY,
	},
	{
		name: "promotions.createBulkCoupons",
		call: (lw) => lw.promotions.createBulkCoupons(ID, BODY),
		method: "POST",
		path: `promotions/${ENC}/coupons-bulk`,
		body: BODY,
	},

	//** affiliates
	{
		name: "affiliates.create",
		call: (lw) => lw.affiliates.create(ID, BODY),
		method: "POST",
		path: `affiliates/${ENC}`,
		body: BODY,
	},
	{
		name: "affiliates.create (no body)",
		call: (lw) => lw.affiliates.create(ID),
		method: "POST",
		path: `affiliates/${ENC}`,
	},

	//** certificates
	{
		name: "certificates.update",
		call: (lw) => lw.certificates.update(ID, BODY),
		method: "PUT",
		path: `certificates/${ENC}`,
		body: BODY,
	},
	{
		name: "certificates.revoke",
		call: (lw) => lw.certificates.revoke(ID),
		method: "PUT",
		path: `certificates/${ENC}/revoke`,
	},
	{
		name: "certificates.delete",
		call: (lw) => lw.certificates.delete(ID),
		method: "DELETE",
		path: `certificates/${ENC}`,
	},

	//** assessments
	{
		name: "assessments.reviewResponse",
		call: (lw) => lw.assessments.reviewResponse(ID, BODY),
		method: "POST",
		path: `assessments/scores/${ENC}/review`,
		body: BODY,
	},

	//** userProgress
	{
		name: "userProgress.complete",
		call: (lw) => lw.userProgress.complete(ID, UID, BODY),
		method: "POST",
		path: `users/${ENC}/courses/${UENC}/complete`,
		body: BODY,
	},
	{
		name: "userProgress.reset",
		call: (lw) => lw.userProgress.reset(ID, UID, BODY),
		method: "POST",
		path: `users/${ENC}/courses/${UENC}/reset`,
		body: BODY,
	},

	//** seats
	{
		name: "seats.create",
		call: (lw) => lw.seats.create(BODY),
		method: "POST",
		path: "seats",
		body: BODY,
	},
	{
		name: "seats.update",
		call: (lw) => lw.seats.update(ID, BODY),
		method: "PUT",
		path: `seats/${ENC}`,
		body: BODY,
	},
	{
		name: "seats.delete",
		call: (lw) => lw.seats.delete(ID),
		method: "DELETE",
		path: `seats/${ENC}`,
	},
	{
		name: "seats.addUser",
		call: (lw) => lw.seats.addUser(ID, UID, { add_to_active_seat: true }),
		method: "POST",
		path: `seats/${ENC}/users/${UENC}`,
		body: { add_to_active_seat: true },
	},
	{
		name: "seats.removeUser",
		call: (lw) =>
			lw.seats.removeUser(ID, UID, { remove_from_seat_offering: true }),
		method: "DELETE",
		path: `seats/${ENC}/users/${UENC}`,
		body: { remove_from_seat_offering: true },
	},

	//** userGroups
	{
		name: "userGroups.create",
		call: (lw) => lw.userGroups.create(BODY),
		method: "POST",
		path: "user_groups",
		body: BODY,
	},
	{
		name: "userGroups.update",
		call: (lw) => lw.userGroups.update(ID, BODY),
		method: "PUT",
		path: `user_groups/${ENC}`,
		body: BODY,
	},
	{
		name: "userGroups.delete",
		call: (lw) => lw.userGroups.delete(ID),
		method: "DELETE",
		path: `user_groups/${ENC}`,
	},
	{
		name: "userGroups.addUser",
		call: (lw) => lw.userGroups.addUser(ID, UID),
		method: "POST",
		path: `user_groups/${ENC}/users/${UENC}`,
	},
	{
		name: "userGroups.removeUser",
		call: (lw) => lw.userGroups.removeUser(ID, UID),
		method: "DELETE",
		path: `user_groups/${ENC}/users/${UENC}`,
	},

	//** community
	{
		name: "community.createSpace",
		call: (lw) => lw.community.createSpace(BODY),
		method: "POST",
		path: "community/spaces",
		body: BODY,
	},
	{
		name: "community.updateSpace",
		call: (lw) => lw.community.updateSpace(ID, BODY),
		method: "PUT",
		path: `community/spaces/${ENC}`,
		body: BODY,
	},
	{
		name: "community.deleteSpace",
		call: (lw) => lw.community.deleteSpace(ID),
		method: "DELETE",
		path: `community/spaces/${ENC}`,
	},
	{
		name: "community.addSpaceUsers",
		call: (lw) => lw.community.addSpaceUsers(ID, { uids: ["1", "2"] }),
		method: "POST",
		path: `community/spaces/${ENC}/users`,
		body: { uids: ["1", "2"] },
	},
	{
		name: "community.removeSpaceUser",
		call: (lw) => lw.community.removeSpaceUser(ID, UID),
		method: "DELETE",
		path: `community/spaces/${ENC}/users/${UENC}`,
	},
];

describe("Write endpoints", () => {
	it.each(cases)("$name", async ({ call, method, path, body }) => {
		const { lw, lastRequest } = createClient();
		const result = await call(lw);
		const req = lastRequest();

		expect(req.method).toBe(method);
		expect(req.url.pathname).toBe(`${BASE}${path}`);
		expect(req.url.search).toBe("");
		expect(req.body).toEqual(body);
		if (body === undefined) {
			expect(req.headers["Content-Type"]).toBeUndefined();
		} else {
			expect(req.headers["Content-Type"]).toBe("application/json");
		}
		expect(req.headers.Authorization).toBe("Bearer T");
		expect(result).toEqual({ ok: true });
	});

	it("Should resolve to undefined on 204 No Content", async () => {
		const { lw } = createClient(() => new Response(null, { status: 204 }));
		expect(await lw.certificates.delete(ID)).toBeUndefined();
	});
});

describe("Query serialization", () => {
	it("Should serialize scalar params and skip undefined ones", async () => {
		const { lw, lastRequest } = createClient();
		await lw.users.getAll({
			page: 2,
			include_suspended: false,
			tags: undefined,
		});
		const { searchParams } = lastRequest().url;

		expect(searchParams.get("page")).toBe("2");
		expect(searchParams.get("include_suspended")).toBe("false");
		expect(searchParams.has("tags")).toBe(false);
	});

	it("Should serialize arrays with the [] suffix", async () => {
		const { lw, lastRequest } = createClient();
		await lw.community.getSpaces({ usages: ["ebook", "course"] });

		expect(lastRequest().url.searchParams.getAll("usages[]")).toEqual([
			"ebook",
			"course",
		]);
	});

	it("Should not send a body or Content-Type on GET", async () => {
		const { lw, lastRequest } = createClient();
		await lw.users.get(ID);
		const req = lastRequest();

		expect(req.method).toBe("GET");
		expect(req.body).toBeUndefined();
		expect(req.headers["Content-Type"]).toBeUndefined();
	});
});

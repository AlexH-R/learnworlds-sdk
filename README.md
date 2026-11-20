# LearnWorlds SDK

**A typed, zero-dependency TypeScript client for the [LearnWorlds](https://www.learnworlds.com) API v2**

> [!NOTE]
> This is an **unofficial** SDK. It is not affiliated with, endorsed or sponsored by LearnWorlds. LearnWorlds is a trademark of its respective owner.

[![npm version](https://img.shields.io/npm/v/@alexh-r/learnworlds-sdk?logo=npm&color=cb3837)](https://www.npmjs.com/package/@alexh-r/learnworlds-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](#typescript)
[![Node](https://img.shields.io/badge/node-%E2%89%A520-339933?logo=node.js&logoColor=white)](#installation)
[![Bun](https://img.shields.io/badge/bun-supported-fbf0df?logo=bun&logoColor=black)](https://bun.sh)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

`@alexh-r/learnworlds-sdk` wraps the LearnWorlds REST API in small, typed resource classes. It handles the OAuth2 `client_credentials` flow for you (token caching and refresh included), builds URLs and query strings, and throws a single error type for anything that goes wrong.

* **Fully typed**: every request body, query and response has a TypeScript type, exported from the package root.
* **No dependencies**: uses the standard `fetch`, so it runs on Node, Bun, Deno and edge runtimes.
* **Automatic auth**: the access token is fetched on the first request, cached, and refreshed a minute before it expires.
* **Cancellable**: every method takes an optional `AbortSignal`.
* **Consistent API**: `getAll()` lists a collection, `get(id)` returns one item, in every resource.

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Usage](#usage): [pagination](#pagination), [cancelling requests](#cancelling-requests), [errors](#error-handling), [async actions](#asynchronous-actions), [custom fetch](#custom-fetch)
- [API reference](#api-reference)
- [TypeScript](#typescript)
- [Development](#development)
- [License](#license)

## Installation

```bash
# bun
bun add @alexh-r/learnworlds-sdk

# npm
npm install @alexh-r/learnworlds-sdk

# pnpm
pnpm add @alexh-r/learnworlds-sdk
```

The package is **ESM only** and needs a runtime with a global `fetch` and `URL.canParse` (Node 20+, Bun, Deno).

## Quick start

You need your school URL plus a **Client ID** and **Client Secret** from the LearnWorlds admin panel (*Settings → Developers → API*).

```ts
import { LearnWorldsClient } from "@alexh-r/learnworlds-sdk";

const lw = new LearnWorldsClient({
	baseUrl: process.env.LW_BASE_URL!, // e.g. https://myschool.learnworlds.com/admin/api
	clientId: process.env.LW_CLIENT_ID!,
	clientSecret: process.env.LW_CLIENT_SECRET!,
});

const { data: courses } = await lw.courses.getAll();
const user = await lw.users.get("student@example.com");

await lw.users.enroll(user.id, {
	productId: courses[0].id,
	productType: "course",
	price: 0,
});
```

> [!WARNING]
> Never hard-code your credentials. Load them from environment variables (or a secrets manager) and keep your `.env` out of version control.

## Configuration

`new LearnWorldsClient(config)` accepts:

| Option         | Type       | Required | Description |
| -------------- | ---------- | :------: | ----------- |
| `baseUrl`      | `string`   | ✅ | Base URL of your school's API. A trailing `/` is added if missing; `v2/` is appended automatically. |
| `clientId`     | `string`   | ✅ | Client ID of your API credentials. Also sent as the `Lw-Client` header. |
| `clientSecret` | `string`   | ✅ | Client Secret of your API credentials. |
| `fetch`        | `FetchFn`  |    | Custom `fetch` implementation (tests, proxies, logging…). Defaults to `globalThis.fetch`. |

The constructor throws a `LearnWorldsError` if `baseUrl` is not a valid URL or if `clientId` / `clientSecret` are missing.

## Usage

Every resource lives on the client instance (`lw.users`, `lw.courses`, …) and every method returns a `Promise` with the typed API response.

### Pagination

Paginated endpoints return a `Paginated<T>`: the page of items in `data` and the pagination info in `meta`. Most of them take a `PageQuery` (`{ page?: number }`), and some add their own filters on top.

```ts
const { data, meta } = await lw.users.getAll({ page: 2, items_per_page: 50 });
// data → User[]
// meta → { page, totalItems, totalPages, itemsPerPage }
```

To walk every page:

```ts
import type { Course } from "@alexh-r/learnworlds-sdk";

const all: Course[] = [];
let page = 1;
let totalPages = 1;

do {
	const res = await lw.courses.getAll({ page });
	all.push(...res.data);
	totalPages = res.meta.totalPages;
	page++;
} while (page <= totalPages);
```

### Cancelling requests

The last argument of every method is an optional `AbortSignal`:

```ts
const user = await lw.users.get("student@example.com", AbortSignal.timeout(5_000));
```

### Error handling

Everything the SDK throws is a `LearnWorldsError`: invalid config, network failures, auth failures and non-2xx responses.

```ts
import { LearnWorldsError } from "@alexh-r/learnworlds-sdk";

try {
	await lw.courses.get("does-not-exist");
} catch (error) {
	if (error instanceof LearnWorldsError) {
		error.message; // "[GET] courses/does-not-exist failed with 404"
		error.status;  // 404 (HTTP status, when there is a response)
		error.body;    // parsed JSON body (or raw text if it isn't JSON)
		error.cause;   // original error (network errors, aborts…)
	}
}
```

### Asynchronous actions

Some operations (`lw.userProgress.complete`, `lw.userProgress.reset`, `lw.seats.delete` and `lw.userGroups.delete`) run in the background and return an `AsyncTask` with a `job_id`. Follow its progress with `lw.asynchronousActions.get`:

```ts
const task = await lw.userProgress.complete(userId, courseId, {
	units: [],
	send_course_complete_email: false,
});
const status = await lw.asynchronousActions.get(task.job_id);
```

### Custom fetch

Pass your own `fetch` to add logging, retries, a proxy, or to mock the API in tests:

```ts
const lw = new LearnWorldsClient({
	baseUrl,
	clientId,
	clientSecret,
	fetch: async (input, init) => {
		console.log(init?.method ?? "GET", String(input));
		return fetch(input, init);
	},
});
```

## API reference

Paths are relative to `<baseUrl>/v2/`. Parameters called `id` accept the resource's id; for users, the email works too.

### Users (`lw.users`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET users` | List all users of the school. Filters: `page`, `items_per_page`, `include_suspended`, `registration_after`, `role`, `status`, `tags`, custom fields (`cf_*`). |
| `get(id)` | `GET users/{id}` | Get a user by id or email. |
| `create(body)` | `POST users` | Create a user. |
| `update(id, body)` | `PUT users/{id}` | Update a user. |
| `getEnrollments(id, query?)` | `GET users/{id}/courses` | List the course enrollments of a user. |
| `getProducts(id)` | `GET users/{id}/products` | List all products of a user. |
| `updateTags(id, body)` | `PUT users/{id}/tags` | Attach or detach tags (`{ tags, action: "attach" \| "detach" }`). |
| `enroll(id, body)` | `POST users/{id}/enrollment` | Enroll a user in a course, bundle or manual subscription. |
| `unenroll(id, body)` | `DELETE users/{id}/enrollment` | Unenroll a user from a product. |
| `suspend(id)` | `PUT users/{id}/suspend` | Suspend a user. |
| `unsuspend(id)` | `PUT users/{id}/unsuspend` | Unsuspend a user. |
| `getSegments()` | `GET users/segments` | List all user segments. |
| `getBySegment(query)` | `GET users/by-segment` | List the users of a segment (`segment_id` required). |
| `getByProduct(query)` | `GET users/by-product` | List the users with access to a product (`product_id`, `product_type` required). |
| `getSeats(id)` | `GET users/{id}/seats` | List the seat offerings a user belongs to. |
| `getGroups(id)` | `GET users/{id}/user-groups` | List the user groups a user belongs to. |
| `getRole(id)` | `GET users/{id}/user-role` | Get the role of a user and its assigned resources. |
| `updateRole(id, body)` | `PUT users/{id}/user-role` | Change the role of a user. |

```ts
const { data: payingUsers } = await lw.users.getAll({ status: "paying" });
await lw.users.updateTags("student@example.com", { tags: ["vip"], action: "attach" });
```

### User progress (`lw.userProgress`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `complete(id, courseId, body)` | `POST users/{id}/courses/{courseId}/complete` | Mark a course (empty `units`) or specific learning activities as complete. Returns an `AsyncTask`. |
| `reset(id, courseId, body)` | `POST users/{id}/courses/{courseId}/reset` | Reset progress on a course (empty `units`) or specific learning activities. Returns an `AsyncTask`. |

### User subscriptions (`lw.userSubscriptions`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET user-subscriptions` | List user subscriptions. Filters: `page`, `status`, `user_id`. |

### Courses (`lw.courses`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET courses` | List all courses (50 per page). Filters: `page`, `access`, `categories`. |
| `get(id)` | `GET courses/{id}` | Get a course. |
| `create(body)` | `POST courses` | Create a course. |
| `update(id, body)` | `PUT courses/{id}` | Update a course. |
| `getUsers(id, query?)` | `GET courses/{id}/users` | List the users enrolled in a course. |
| `getContents(id)` | `GET courses/{id}/contents` | Get the sections and learning activities of a course. |
| `createSection(id, body)` | `POST courses/{id}/sections` | Add a section to a course. |
| `getGrades(id, query?)` | `GET courses/{id}/grades` | Get the grades of all enrolled users. |

### Bundles (`lw.bundles`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET bundles` | List all bundles. |
| `get(id)` | `GET bundles/{id}` | Get a bundle. |

### Subscription plans (`lw.subscriptionPlans`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET subscription-plans` | List all subscription plans. |
| `get(id)` | `GET subscription-plans/{id}` | Get a subscription plan. |

### Installments (`lw.installments`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getActive(query?)` | `GET installments/active` | List active installments. Filters: `page`, `product_id`, `product_type`, `user_id`. |

### Payments (`lw.payments`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET payments` | List all payments, newest first. |
| `get(id)` | `GET payments/{id}` | Get a payment. |
| `getInvoiceLink(id)` | `GET payments/{id}/invoice-link` | Get the invoice number and a private, expiring link to the invoice. |

### Promotions (`lw.promotions`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET promotions` | List all promotions. |
| `get(id)` | `GET promotions/{id}` | Get a promotion. |
| `create(body)` | `POST promotions` | Create a promotion (without coupons). |
| `getCoupons(id)` | `GET promotions/{id}/coupons` | List the coupons of a promotion. |
| `createCoupon(id, body)` | `POST promotions/{id}/coupons` | Create a coupon. |
| `createBulkCoupons(id, body)` | `POST promotions/{id}/coupons-bulk` | Create coupons in bulk. |
| `getCouponUsage(id, code, query?)` | `GET promotions/{id}/coupons/{code}/usage` | Get the usage of a coupon and its payments. |

### Affiliates (`lw.affiliates`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET affiliates` | List all affiliates. |
| `create(id, body?)` | `POST affiliates/{id}` | Make a user an affiliate. |
| `getLeads(id, query?)` | `GET affiliates/{id}/leads` | List the leads of an affiliate. |
| `getCustomers(id, query?)` | `GET affiliates/{id}/customers` | List the customers of an affiliate. |
| `getPayments(id, query?)` | `GET affiliates/{id}/payments` | List the payments of an affiliate. |
| `getUpcomingPayouts(id)` | `GET affiliates/{id}/payouts/upcoming` | List upcoming payouts. |
| `getDuePayouts(id)` | `GET affiliates/{id}/payouts/due` | List due payouts. |
| `getCompletedPayouts(id, query?)` | `GET affiliates/{id}/payouts/completed` | List completed payouts. |

### Leads (`lw.leads`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET leads` | List all leads of the school. |

### Seats (`lw.seats`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET seats` | List all seat offerings. |
| `get(id)` | `GET seats/{id}` | Get a seat offering. |
| `create(body)` | `POST seats` | Create a seat offering (at least one course or learning program in `products`). |
| `update(id, body)` | `PUT seats/{id}` | Update a seat offering. |
| `delete(id)` | `DELETE seats/{id}` | Delete a seat offering. Returns an `AsyncTask`. |
| `getUsers(id, query?)` | `GET seats/{id}/users` | List the members of a seat offering. |
| `addUser(id, userId)` | `POST seats/{id}/users/{userId}` | Add a user to a seat offering. |
| `removeUser(id, userId, body)` | `DELETE seats/{id}/users/{userId}` | Remove a user from their seat (and optionally from the offering). |

### User groups (`lw.userGroups`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET user_groups` | List all user groups. |
| `get(id)` | `GET user_groups/{id}` | Get a user group. |
| `create(body)` | `POST user_groups` | Create a user group. |
| `update(id, body)` | `PUT user_groups/{id}` | Update a user group. Each list in `products` replaces only the products of its type. |
| `delete(id)` | `DELETE user_groups/{id}` | Delete a user group. Returns an `AsyncTask`. |
| `getUsers(id, query?)` | `GET user_groups/{id}/users` | List the members of a user group. |
| `addUser(id, userId)` | `POST user_groups/{id}/users/{userId}` | Add a user to a user group. |
| `removeUser(id, userId)` | `DELETE user_groups/{id}/users/{userId}` | Remove a user from a user group. |

### User roles (`lw.userRoles`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll()` | `GET user-roles` | List all user roles of the school, sorted by title. |

### Certificates (`lw.certificates`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query)` | `GET certificates` | List certificates (`user_id` or `course_id` required). |
| `update(id, body)` | `PUT certificates/{id}` | Update `issued`, `expires_on` or `form`. |
| `revoke(id)` | `PUT certificates/{id}/revoke` | Revoke a certificate (kept with status `revoked`). |
| `delete(id)` | `DELETE certificates/{id}` | Delete a certificate permanently. |

### Assessments (`lw.assessments`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getResponses(id, query?)` | `GET assessments/{id}/responses` | List the responses of an assessment. |
| `getFormResponses(id, query?)` | `GET forms/{id}/responses` | List the responses of a form. |
| `reviewResponse(responseId, body)` | `POST assessments/scores/{responseId}/review` | Grade and give feedback on a submission. |

### Community (`lw.community`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getCollections()` | `GET community/collections` | List all community collections. |
| `getSpaces(query?)` | `GET community/spaces` | List all spaces. Filters: `page`, `items_per_page`, `access`, `collectionId`, `usages`. |
| `createSpace(body)` | `POST community/spaces` | Create a space. `collectionId` is required for public and private spaces and not allowed for standalone ones. |
| `getSpace(id)` | `GET community/spaces/{id}` | Get a space. |
| `updateSpace(id, body)` | `PUT community/spaces/{id}` | Update a space. `access` can't be changed to or from `standalone`. |
| `deleteSpace(id)` | `DELETE community/spaces/{id}` | Delete a space. |
| `getSpaceUsers(id, query?)` | `GET community/spaces/{id}/users` | List the users of a space and their status. |
| `addSpaceUsers(id, body)` | `POST community/spaces/{id}/users` | Add or invite users to a space (`{ uids }`). |
| `removeSpaceUser(id, userId)` | `DELETE community/spaces/{id}/users/{userId}` | Remove a user from a space. |
| `getPosts(query?)` | `GET community/posts` | List community posts. Filters: `page`, `items_per_page`, `course_id`, `space_id`, `user_id`, `mentions`. |
| `getPost(id)` | `GET community/posts/{id}` | Get a post. |

### Reporting (`lw.reporting`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getCourseAnalytics(id)` | `GET courses/{id}/analytics` | Analytics of a course. |
| `getLearningActivityAnalytics(id, unitId)` | `GET courses/{id}/units/{unitId}/analytics` | Analytics of a learning activity. |
| `getUserProgress(id)` | `GET users/{id}/progress` | Progress of a user in all their courses. |
| `getUserProgressPerCourse(id, courseId)` | `GET users/{id}/courses/{courseId}/progress` | Progress of a user in one course. |

### Event logs (`lw.eventLogs`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getAll(query?)` | `GET event-logs` | List the event logs of the school (50 per page). |

### Calendar (`lw.calendar`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `getSchoolEvents(query?)` | `GET school/events` | Upcoming school events (drip feed, file assignments, live sessions). Filter by `event_type`. |

### Asynchronous actions (`lw.asynchronousActions`)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `get(id)` | `GET async-actions/{id}` | Progress of an asynchronous action, by its `job_id`. |

## TypeScript

All models, request bodies and query types are exported as types from the package root:

```ts
import type { Course, User, Payment, SeatOffering } from "@alexh-r/learnworlds-sdk";

function greet(user: User) {
	return `Hi ${user.username}`;
}
```

Shared helper types are exported too:

* `Paginated<T>`: the `{ data, meta }` shape returned by paginated endpoints.
* `PageQuery`: the `{ page?: number }` query taken by most of them.
* `AsyncTask` / `AsyncTaskStatus`: what background operations return and what `lw.asynchronousActions.get` reports.

```ts
import type { Paginated, User } from "@alexh-r/learnworlds-sdk";

async function firstPage(): Promise<Paginated<User>> {
	return lw.users.getAll();
}
```

The `LearnWorldsClientConfig` interface is exported as well.

## Development

The project uses [Bun](https://bun.sh) for development and [Biome](https://biomejs.dev) (tabs) for linting and formatting. The published build is plain JavaScript plus `.d.ts` files, compiled with `tsc`.

```bash
bun install          # install dependencies
bun test             # run the tests
bun run lint         # lint and format src/ with Biome
bun run build        # compile to dist/
```

`prepublishOnly` builds and tests the package before every publish.

## License

[MIT](LICENSE). This project is not affiliated with LearnWorlds; see the note at the top.

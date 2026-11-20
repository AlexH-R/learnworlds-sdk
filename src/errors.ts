export class LearnWorldsError extends Error {
	readonly status?: number;
	readonly body?: unknown;

	constructor(
		message: string,
		options?: ErrorOptions & { status?: number; body?: unknown },
	) {
		super(
			message,
			options?.cause !== undefined ? { cause: options.cause } : undefined,
		);
		this.name = new.target.name;
		this.status = options?.status;
		this.body = options?.body;
	}
}

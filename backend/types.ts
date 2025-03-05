import session from "express-session";

// Extend express-session module
declare module "express-session" {
	interface SessionData {
		game?: {
			id: number;
			players: { id: number; name: string }[];
		};
	}
}

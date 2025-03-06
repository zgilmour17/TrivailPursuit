import session from "express-session";

// Extend express-session module
declare module "express-session" {
	interface SessionData {
		game: {
			id: number;
			host: { id: number; name: string };
			players: { id: number; name: string }[];
		};
	}
}

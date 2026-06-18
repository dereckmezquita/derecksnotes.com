-- I3: store SHA-256 (or HMAC-SHA256 with SESSION_TOKEN_PEPPER) of the
-- session cookie value instead of the raw token. A DB compromise after this
-- migration cannot resume any live session.
--
-- No backwards-compat: there are no production users yet. Existing rows
-- (mostly seed/dev) are dropped; users re-login on next visit.

DROP INDEX IF EXISTS `sessions_token_unique`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);

CREATE TABLE `error_summary` (
	`id` text PRIMARY KEY NOT NULL,
	`fingerprint` text NOT NULL,
	`message` text NOT NULL,
	`source` text,
	`stack` text,
	`first_seen_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`resolved` integer DEFAULT false NOT NULL,
	`resolved_at` integer,
	`resolved_by` text,
	`notes` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `error_summary_fingerprint_unique` ON `error_summary` (`fingerprint`);--> statement-breakpoint
CREATE TABLE `server_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`level` text NOT NULL,
	`message` text NOT NULL,
	`source` text,
	`context` text,
	`stack` text,
	`user_id` text,
	`request_id` text,
	`ip_address` text,
	`user_agent` text,
	`path` text,
	`method` text,
	`status_code` integer,
	`duration` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_server_logs_level` ON `server_logs` (`level`);--> statement-breakpoint
CREATE INDEX `idx_server_logs_source` ON `server_logs` (`source`);--> statement-breakpoint
CREATE INDEX `idx_server_logs_created_at` ON `server_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_server_logs_level_created` ON `server_logs` (`level`,`created_at`);
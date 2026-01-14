-- Add soft clear columns to server_logs table
ALTER TABLE `server_logs` ADD COLUMN `cleared_at` integer;
--> statement-breakpoint
ALTER TABLE `server_logs` ADD COLUMN `cleared_by` text;

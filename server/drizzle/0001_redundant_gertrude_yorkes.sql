ALTER TABLE `comments` ADD `pinned_at` integer;--> statement-breakpoint
ALTER TABLE `comments` ADD `pinned_by` text REFERENCES users(id);
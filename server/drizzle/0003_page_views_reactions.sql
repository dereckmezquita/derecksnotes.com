-- Create posts table
CREATE TABLE IF NOT EXISTS `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `posts_slug_unique` ON `posts` (`slug`);
--> statement-breakpoint

-- Create page_views table
CREATE TABLE IF NOT EXISTS `page_views` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`ip_address` text NOT NULL,
	`user_agent` text NOT NULL,
	`referrer` text,
	`session_id` text,
	`user_id` text,
	`is_bot` integer DEFAULT false NOT NULL,
	`entered_at` integer NOT NULL,
	`exited_at` integer,
	`duration` integer,
	`scroll_depth` integer,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `page_views_post_idx` ON `page_views` (`post_id`);
--> statement-breakpoint

-- Create post_reactions table
CREATE TABLE IF NOT EXISTS `post_reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `post_reactions_user_post_idx` ON `post_reactions` (`post_id`,`user_id`);

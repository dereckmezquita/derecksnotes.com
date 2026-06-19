CREATE INDEX IF NOT EXISTS `comments_post_parent_created_idx` ON `comments` (`post_id`, `parent_id`, `created_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `comments_parent_created_idx` ON `comments` (`parent_id`, `created_at`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `comments_user_created_idx` ON `comments` (`user_id`, `created_at`);

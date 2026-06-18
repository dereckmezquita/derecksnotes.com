CREATE TABLE `graph_edges` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`target_id` text NOT NULL,
	`edge_type` text NOT NULL,
	`weight` integer DEFAULT 1 NOT NULL,
	`metadata` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `graph_nodes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_id`) REFERENCES `graph_nodes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `graph_key_terms` (
	`id` text PRIMARY KEY NOT NULL,
	`node_id` text NOT NULL,
	`term` text NOT NULL,
	`frequency` integer DEFAULT 1 NOT NULL,
	`tfidf` integer,
	FOREIGN KEY (`node_id`) REFERENCES `graph_nodes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `graph_nodes` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`title` text NOT NULL,
	`section` text NOT NULL,
	`category` text,
	`tags` text,
	`date` text,
	`author` text,
	`snippet` text,
	`node_type` text NOT NULL,
	`parent_id` text,
	`depth` integer DEFAULT 0 NOT NULL,
	`metadata` text,
	`content_hash` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `graph_nodes_path_unique` ON `graph_nodes` (`path`);--> statement-breakpoint
CREATE TABLE `graph_vectors` (
	`id` text PRIMARY KEY NOT NULL,
	`node_id` text NOT NULL,
	`vector` text NOT NULL,
	FOREIGN KEY (`node_id`) REFERENCES `graph_nodes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `graph_vectors_node_id_unique` ON `graph_vectors` (`node_id`);
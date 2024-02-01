create table users (
  `id` bigint unsigned PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(255) NULL,
  `last_name` varchar(255) NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(64) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `todos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int DEFAULT NULL,
  `due_date` timestamp NULL DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `status` enum('pending','done') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `todos_user_id_foreign` (`user_id`),
  CONSTRAINT `todos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
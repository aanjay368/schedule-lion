CREATE TABLE `schedules` (
  `id` VARCHAR(36) NOT NULL primary key,
  `date` DATE NOT NULL,
  `shift_id` INT NOT NULL,
  `division_id` INT NOT NULL,
  `position_id` INT NOT NULL,
  `owner_id` VARCHAR(36) NULL,
  `filler_id` VARCHAR(36) NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`),
  FOREIGN KEY (`division_id`) REFERENCES `divisions`(`id`),
  FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`),
  FOREIGN KEY fk_schedules_owner (`owner_id`) REFERENCES `employees`(`id`),
  FOREIGN KEY fk_schedules_filler (`filler_id`) REFERENCES `employees`(`id`)
);
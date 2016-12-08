SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `todo` ;
CREATE SCHEMA IF NOT EXISTS `todo` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `todo` ;

-- -----------------------------------------------------
-- Table `todo`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`User` ;

CREATE TABLE IF NOT EXISTS `todo`.`User` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` TEXT NULL,
  `Email` TEXT NULL,
  `Username` TEXT(20) NULL,
  `Password` TEXT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo`.`ToDoList`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`ToDoList` ;

CREATE TABLE IF NOT EXISTS `todo`.`ToDoList` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` TEXT NULL,
  `CreationDate` TIMESTAMP NULL,
  `Owner` INT(11) NULL,
  `IsPublic` TINYINT(1) NULL,
  PRIMARY KEY (`Id`),
  INDEX `list_owner_idx` (`Owner` ASC),
  CONSTRAINT `list_owner`
    FOREIGN KEY (`Owner`)
    REFERENCES `todo`.`User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo`.`ToDoItem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`ToDoItem` ;

CREATE TABLE IF NOT EXISTS `todo`.`ToDoItem` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Title` TEXT NULL,
  `Text` TEXT NULL,
  `CreationDate` TIMESTAMP NULL,
  `DueDate` TIMESTAMP NULL,
  `Completed` TINYINT(1) NULL,
  `CompletionDate` TIMESTAMP NULL,
  `Priority` INT(11) NOT NULL,
  `ToDoListID` INT(11) NULL,
  `ParentToDo` INT(11) NULL,
  PRIMARY KEY (`Id`, `Priority`),
  INDEX `item_list_idx` (`ToDoListID` ASC),
  INDEX `parent_child_idx` (`ParentToDo` ASC),
  CONSTRAINT `item_list`
    FOREIGN KEY (`ToDoListID`)
    REFERENCES `todo`.`ToDoList` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `parent_child`
    FOREIGN KEY (`ParentToDo`)
    REFERENCES `todo`.`ToDoItem` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo`.`ToDoAssignment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`ToDoAssignment` ;

CREATE TABLE IF NOT EXISTS `todo`.`ToDoAssignment` (
  `ToDoId` INT(11) NOT NULL AUTO_INCREMENT,
  `AssigneeId` INT(11) NOT NULL,
  `AssignDate` TIMESTAMP NULL,
  PRIMARY KEY (`ToDoId`, `AssigneeId`),
  INDEX `assignee_id_idx` (`AssigneeId` ASC),
  CONSTRAINT `assingment_todo`
    FOREIGN KEY (`ToDoId`)
    REFERENCES `todo`.`ToDoItem` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `assignment_assignee`
    FOREIGN KEY (`AssigneeId`)
    REFERENCES `todo`.`User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo`.`Tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`Tag` ;

CREATE TABLE IF NOT EXISTS `todo`.`Tag` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Text` TEXT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `todo`.`ItemTag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `todo`.`ItemTag` ;

CREATE TABLE IF NOT EXISTS `todo`.`ItemTag` (
  `ToDoId` INT(11) NOT NULL,
  `TagId` INT(11) NOT NULL,
  PRIMARY KEY (`ToDoId`, `TagId`),
  INDEX `tag_id_idx` (`TagId` ASC),
  CONSTRAINT `tag_todo`
    FOREIGN KEY (`ToDoId`)
    REFERENCES `todo`.`ToDoItem` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `tag_tag`
    FOREIGN KEY (`TagId`)
    REFERENCES `todo`.`Tag` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `todo`.`User`
-- -----------------------------------------------------
START TRANSACTION;
USE `todo`;
INSERT INTO `todo`.`User` (`Id`, `Name`, `Email`, `Username`, `Password`) VALUES (1, 'user1', 'user1@to.do', 'user1', 'pass1');
INSERT INTO `todo`.`User` (`Id`, `Name`, `Email`, `Username`, `Password`) VALUES (2, 'user2', 'user2@to.do', 'user2', 'pass2');

COMMIT;


-- -----------------------------------------------------
-- Data for table `todo`.`ToDoList`
-- -----------------------------------------------------
START TRANSACTION;
USE `todo`;
INSERT INTO `todo`.`ToDoList` (`Id`, `Name`, `CreationDate`, `Owner`, `IsPublic`) VALUES (1, 'School', '2013-01-25 12:35:00', 1, 0);
INSERT INTO `todo`.`ToDoList` (`Id`, `Name`, `CreationDate`, `Owner`, `IsPublic`) VALUES (2, 'Work', '2014-02-14 00:00:00', 1, 0);
INSERT INTO `todo`.`ToDoList` (`Id`, `Name`, `CreationDate`, `Owner`, `IsPublic`) VALUES (3, 'Shared', '2014-09-05 00:00:00', 2, 1);
INSERT INTO `todo`.`ToDoList` (`Id`, `Name`, `CreationDate`, `Owner`, `IsPublic`) VALUES (4, 'Personal', '2014-10-22 00:00:00', 2, 0);

COMMIT;


-- -----------------------------------------------------
-- Data for table `todo`.`ToDoItem`
-- -----------------------------------------------------
START TRANSACTION;
USE `todo`;
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (1, 'Do assignment 1', 'Finish assignment one before the assessment time', '2014-11-17 12:56:12', '2014-11-20 23:59:59', 1, '2014-11-20 23:55:15', 3, 1, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (3, 'Do HTML part of assignment 1', 'Do the html part of the first assignment: code and design', '2014-11-18 15:26:58', '2014-11-20 23:59:59', 1, '2014-11-19 15:59:36', 3, 1, 1);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (2, 'Do telnet exercises', 'Do all telnet exercises and understand what is happening and why', '2014-11-18 22:51:48', '2014-11-20 23:59:59', 1, '2014-11-18 13:35:48', 3, 1, 1);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (4, 'Bring presents to the children', 'Bring presents to all the children without being spotted', '2014-11-22 09:12:55', '2014-12-05 23:59:59', 0, NULL, 3, 2, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (5, 'Do the paperwork', 'Do the paperwork to finish the work we did', '2014-11-22 09:13:25', '2014-12-22 12:00:00', 0, NULL, 1, 2, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (6, 'Finish the group assignment', 'We need to finish the group assignment,preferably long before the deadline', '2014-09-05 12:45:35', '2014-12-10 23:59:59', 0, NULL, 2, 3, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (7, 'Creates images', 'We can create images to make the assignment look better', '2014-10-25 21:25:55', '2014-12-09 23:59:59', 1, '2014-10-27 12:59:46', 1, 3, 6);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (8, 'Finish chapter 1', 'Finish and check the text for chapter 1', '2014-10-05 21:26:54', '2014-12-09 23:59:59', 1, '2014-12-04 01:22:15', 2, 3, 6);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (9, 'Finish chapter 2', 'Finish and check chapter 2', '2014-10-25 21:57:58', '2014-12-09 23:59:59', 1, '2014-12-05 12:35-22', 2, 3, 6);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (10, 'Finish conclusion', 'Finish and check the conclusion', '2014-11-24 22:02:35', '2014-12-09 23:59:59', 0, NULL, 2, 3, 6);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (11, 'Celebrate we finished the assignment', 'We need to celebrate after we finished the assignment!!', '2014-11-24 12:55:36', '2014-12-12 18:00:00', 0, NULL, 3, 3, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (12, 'Leg day', 'Go to the gym', '2014-11-17 12:55:36', '2014-11-24 15:00:00', 1, '2014-11-24 15:05:56', 1, 4, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (13, 'Exercise', 'Cycle 50 kms', '2014-11-20 14:52:45', '2014-11-27 16:00:00', 0, NULL, 1, 4, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (14, 'Exercise', 'Run 10k', '2014-11-24 18:55:0', '2014-12-01 00:00:00', 0, NULL, 1, 4, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (15, 'Celebrate birthday', 'With all my friends!', '2014-11-02 18:25:44', '2014-12-24 23:59:59', 0, NULL, 3, 4, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (16, 'Visit grandma', 'Don\'t forget to bring a little present', '2014-05-14 11:52:44', '2014-05-22 15:00:00', 1, '2014-05-22 17:11:25', 2, 4, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (17, 'Assignment 2', 'Fix all parts of assignment 2 for webdata', '2014-11-25 12:22:45', '2014-11-27 15:45:00', 1, '2014-11-27 12:52:33', 3, 1, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (18, 'First part of 2', 'Do the first part of the second assignment', '2014-11-25 12:23:15', '2014-11-27 15:45:00', 1, '2014-11:26 09:12:52', 3, 1, 17);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (19, 'Second part of 2', 'Do the second part of the second assignment', '2014-11-25 12:25:55', '2014-11-27 15:45:00', 1, '2014-11-27 12:52:33', 3, 1, 17);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (20, 'Learn for Midterm', 'For webdata midterm', '2014-12-01 14:55:32', '2014-12-09 09:00:00', 1, '2014-11-08 22:55:15', 1, 1, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (21, 'Vacuum', 'in my room', '2014-11-22 12:55:22', '2014-11-27 12:00:00', 1, '2014-11-25 15:44:22', 1, 4, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (22, 'Assigment 3 and 4', 'For webdata', '2014-12-02 16:11:25', '2014-12-18 12:00:00', 0, NULL, 3, 1, NULL);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (23, 'Assignemnt 3 part 1 ', 'part 1 for A3', '2014-12-02 16:12:11', '2014-12-18 12:00:00', 1, '2014-12-14 12:55:34', 3, 1, 22);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (24, 'Assignment 3 part 2', 'part 2 for A3', '2014-12-02 16:12:55', '2014-12-18 12:00:00', 1, '2014-12-14 18:32:56', 3, 1, 22);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (25, 'Assignment 4 part 1', 'part 1 for A4', '2014-12-02 16:14:25', '2014-12-18 12:00:00', 1, '2014-12-16 13:25:56', 3, 1, 22);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (26, 'Assignment 4 part 2', 'part 2 for A4', '2014-12-02 16:15:45', '2014-12-18 12:00:00', 0, NULL, 3, 1, 22);
INSERT INTO `todo`.`ToDoItem` (`Id`, `Title`, `Text`, `CreationDate`, `DueDate`, `Completed`, `CompletionDate`, `Priority`, `ToDoListID`, `ParentToDo`) VALUES (27, 'Create database for students', 'So they can practice with the assignments', '2014-12-12 15:48:55', '2014-12-16 23:59:59', 1, '2014-12-16 15:22:45', 3, 1, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `todo`.`Tag`
-- -----------------------------------------------------
START TRANSACTION;
USE `todo`;
INSERT INTO `todo`.`Tag` (`Id`, `Text`) VALUES (1, 'webdata');
INSERT INTO `todo`.`Tag` (`Id`, `Text`) VALUES (2, 'sport');
INSERT INTO `todo`.`Tag` (`Id`, `Text`) VALUES (3, 'school');
INSERT INTO `todo`.`Tag` (`Id`, `Text`) VALUES (4, 'work');
INSERT INTO `todo`.`Tag` (`Id`, `Text`) VALUES (5, 'personal');

COMMIT;


-- -----------------------------------------------------
-- Data for table `todo`.`ItemTag`
-- -----------------------------------------------------
START TRANSACTION;
USE `todo`;
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (1, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (1, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (2, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (2, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (3, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (3, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (4, 4);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (5, 4);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (6, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (7, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (8, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (9, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (10, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (11, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (11, 5);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (12, 5);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (12, 2);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (13, 5);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (13, 2);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (14, 5);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (14, 2);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (15, 5);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (16, 5);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (17, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (17, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (18, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (18, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (19, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (19, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (20, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (20, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (21, 5);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (22, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (22, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (23, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (23, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (24, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (24, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (25, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (25, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (26, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (26, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (27, 1);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (27, 3);
INSERT INTO `todo`.`ItemTag` (`ToDoId`, `TagId`) VALUES (27, 5);

COMMIT;


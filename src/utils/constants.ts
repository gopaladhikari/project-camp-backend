/**
 * These are the available roles
 */
export enum UserRoles {
  ADMIN = "admin",
  PROJECT_ADMIN = "project-admin",
  MEMBER = "member",
}

/**
 * These are the available roles in a iterable format
 */
export const avilableRoles = Object.values(UserRoles);

/**
 * These are the available task status
 */

export enum TaskStaus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

/**
 * These are the available task status in a iterable format
 */
export const avilableTaskStatus = Object.values(TaskStaus);

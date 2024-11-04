
import { IRoleModel } from "@smpm/models/roleModel";

export const dummyRoleData: IRoleModel[] = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all system features",
    permissions: ["create", "read", "update", "delete", "manage_users"],
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-01-15T08:30:00Z"
  },
  {
    id: 2,
    name: "Manager",
    description: "Access to manage projects and teams",
    permissions: ["read", "update", "manage_projects", "manage_teams"],
    createdAt: "2023-02-20T10:15:00Z",
    updatedAt: "2023-02-20T10:15:00Z"
  },
  {
    id: 3,
    name: "Developer",
    description: "Access to development tools and resources",
    permissions: ["read", "update", "use_dev_tools"],
    createdAt: "2023-03-10T14:45:00Z",
    updatedAt: "2023-03-10T14:45:00Z"
  },
  {
    id: 4,
    name: "HR",
    description: "Access to human resources information",
    permissions: ["read", "update", "manage_employees"],
    createdAt: "2023-04-05T09:00:00Z",
    updatedAt: "2023-04-05T09:00:00Z"
  },
  {
    id: 5,
    name: "Viewer",
    description: "Read-only access to general information",
    permissions: ["read"],
    createdAt: "2023-05-01T11:30:00Z",
    updatedAt: "2023-05-01T11:30:00Z"
  }
];

export interface JsonStats {
  keys: number;
  depth: number;
  size: number;
  arrays: number;
  objects: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
}

export type ViewTab = "formatted" | "tree" | "compare";

export const SAMPLE_JSON = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  isActive: true,
  roles: ["admin", "editor"],
  address: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  projects: [
    {
      id: 1,
      name: "Website Redesign",
      status: "completed",
      tags: ["design", "frontend"],
    },
    {
      id: 2,
      name: "API Integration",
      status: "in-progress",
      tags: ["backend", "api"],
    },
  ],
  metadata: {
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-03-22T14:45:00Z",
    version: 2.1,
    settings: { theme: "dark", notifications: true, language: "en" },
  },
};

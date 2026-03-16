import type { ContainerType } from "../types";
import { ValidationError } from "../utils/errors";

const validContainers = new Set<ContainerType>([
  "plastic",
  "paper",
  "glass",
  "mixed",
  "bio",
  "metal",
  "hazardous",
  "electro",
  "carton",
]);

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidContainerType(value: unknown): value is ContainerType {
  return typeof value === "string" && validContainers.has(value as ContainerType);
}

export function sanitizeStringInput(
  value: unknown,
  options: { maxLength?: number; required?: boolean } = {},
) {
  const { maxLength = 500, required = false } = options;

  if (typeof value !== "string") {
    if (required) {
      throw new ValidationError("Expected a string value");
    }

    return undefined;
  }

  const sanitized = value.trim();

  if (!sanitized) {
    if (required) {
      throw new ValidationError("Required string value is empty");
    }

    return undefined;
  }

  return sanitized.length > maxLength ? sanitized.slice(0, maxLength) : sanitized;
}

export function isValidUuid(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value);
}

export function assertUuid(value: unknown, fieldName = "id") {
  if (!isValidUuid(value)) {
    throw new ValidationError(`${fieldName} must be a valid UUID`);
  }

  return value;
}

export function assertContainerType(value: unknown, fieldName = "container") {
  if (!isValidContainerType(value)) {
    throw new ValidationError(`${fieldName} must be a valid waste container type`);
  }

  return value;
}

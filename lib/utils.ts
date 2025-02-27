import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object into a regular object
// Typescript generic it's basically a placeholder for any type that the function might accept when it's called
// value: T is just specifying that the type of the parameter or argument that the function accepts is T
export function convertToPlainObject<T>(object: T): T {
  return JSON.parse(JSON.stringify(object))
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.')
  return decimal ? `${int}.${decimal.slice(0, 2)}` : `${int}.00`
}
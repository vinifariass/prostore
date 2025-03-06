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

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export async function formatErrors(error: any) {
  if (error.name === 'ZodError') {
    //Handle zod error
    const fieldErros = Object.keys(error.errors).map((field) => error.errors[field].message)
    return fieldErros.join('. ')
  } else if (error.code === 'P2002' && error.name === 'PrismaClientKnownRequestError') {
    //Handle prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field'
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  } else {
    // Handle other errors
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
  }
}

// Rounded number to 2 decimal places

export function round2(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100
  } else {
    throw new Error('Value must be a number or string')
  }
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://faculty-backend-1zre.onrender.com';
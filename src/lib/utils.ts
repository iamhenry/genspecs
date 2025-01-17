/**
 * @fileoverview Utility functions for common operations across the application.
 * Currently provides class name merging functionality using clsx and tailwind-merge.
 * 
 * @module utils
 * @requires clsx
 * @requires tailwind-merge
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

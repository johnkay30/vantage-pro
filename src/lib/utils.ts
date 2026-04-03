// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** * Universal Adapter: Safely gets a value from any data row.
 */
export const getColVal = (row: any, key: string) => {
  if (!row || !key) return "";
  return row[key] !== undefined ? row[key] : "";
};

/** * Chart Formatter: This is the secret to the "A-Ha" moment.
 * It forces all data into 'name' and 'value' so charts never break.
 */
export const formatForCharts = (data: any[], xKey: string, yKey: string) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map((item) => ({
    name: String(getColVal(item, xKey)), 
    // CRITICAL: Number() ensures the Bar/Column has height!
    value: Number(String(getColVal(item, yKey)).replace(/[^0-9.-]+/g, "")) || 0, 
  }));
};
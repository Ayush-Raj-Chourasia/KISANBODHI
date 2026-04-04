/**
 * Utility functions for the backend system
 */

/**
 * Generate unique IDs
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(newValue: number, oldValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Round to 2 decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

/**
 * Format INR currency
 */
export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Get risk level label
 */
export function getRiskLabel(score: number): string {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  if (score >= 20) return "Low";
  return "Very Low";
}

/**
 * Get risk color
 */
export function getRiskColor(score: number): string {
  if (score >= 80) return "#dc2626"; // red
  if (score >= 60) return "#f97316"; // orange
  if (score >= 40) return "#eab308"; // yellow
  if (score >= 20) return "#84cc16"; // lime
  return "#22c55e"; // green
}

/**
 * Delay execution (for testing/demo)
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}

/**
 * Get current season
 */
export function getCurrentSeason(): "kharif" | "rabi" | "summer" {
  const month = new Date().getMonth();

  // Kharif: June-September (month 5-8)
  // Rabi: October-March (month 9-2)
  // Summer: April-May (month 3-4)

  if (month >= 5 && month <= 8) return "kharif";
  if (month >= 9 || month <= 2) return "rabi";
  return "summer";
}

/**
 * Batch process array with timeout
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}

/**
 * Retry logic for failed operations
 */
export async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await delay(delayMs * attempt);
      }
    }
  }

  throw lastError || new Error("Operation failed after retries");
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Convert mm rainfall to inches
 */
export function mmToInches(mm: number): number {
  return mm / 25.4;
}

/**
 * Get crop yield recommendation based on risk
 */
export function getYieldRecommendation(riskScore: number): {
  reduction: number;
  message: string;
} {
  if (riskScore >= 80) {
    return {
      reduction: 0.4,
      message: "Expect 40% yield reduction. Focus on risk mitigation.",
    };
  }
  if (riskScore >= 60) {
    return {
      reduction: 0.25,
      message: "Expect 25% yield reduction. Implement protective measures.",
    };
  }
  if (riskScore >= 40) {
    return {
      reduction: 0.1,
      message: "Expect 10% yield reduction. Monitor closely.",
    };
  }
  return {
    reduction: 0,
    message: "Expected normal yield. Continue routine management.",
  };
}

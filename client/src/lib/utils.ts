import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function shortFormatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

export function getRelativeDateString(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  
  // Same day
  if (d.toDateString() === now.toDateString()) {
    return "Today";
  }
  
  // Tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  
  // Format the date
  return shortFormatDate(d);
}

export function calculateTotalPeople(counts: any[]): { total: number, adults: number, children: number } {
  let adults = 0, children = 0;
  counts.forEach(count => {
    adults += count.adultCount || 0;
    children += count.childCount || 0;
  });
  
  return {
    total: adults + children,
    adults,
    children
  };
}

export function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-600 text-white";
    case "pending":
      return "bg-blue-600 text-white";
    case "needs_adjustment":
      return "bg-yellow-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
}

export function getFormattedStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case "needs_adjustment":
      return "Needs Adjustment";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

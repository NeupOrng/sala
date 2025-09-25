export function formatDateToStringForInputComponent(dateInput: string | Date): string {
  // Create a Date object from the input (accepts various date string formats or Date object)
  const date = new Date(dateInput);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date input');
  }

  // Extract components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Return formatted string
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
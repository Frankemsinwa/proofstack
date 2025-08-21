
import { toZonedTime } from 'date-fns-tz';

const TIME_ZONE = 'Africa/Lagos';

/**
 * Checks if the current time in Africa/Lagos is a Friday.
 * @returns {boolean} True if it's Friday in Africa/Lagos, false otherwise.
 */
export const isFridayNow = () => {
  const now = new Date();
  const zonedNow = toZonedTime(now, TIME_ZONE);
  return zonedNow.getDay() === 5; // 5 = Friday
};

/**
 * Gets the end of the current Friday in Africa/Lagos.
 * @returns {Date} A Date object representing the end of Friday.
 */
export const getEndOfFriday = () => {
  const now = new Date();
  const zonedNow = toZonedTime(now, TIME_ZONE);
  
  // If it's not Friday, find the next Friday
  if (zonedNow.getDay() !== 5) {
    const daysUntilFriday = (5 - zonedNow.getDay() + 7) % 7;
    zonedNow.setDate(zonedNow.getDate() + daysUntilFriday);
  }
  
  const endOfFriday = new Date(zonedNow);
  endOfFriday.setHours(23, 59, 59, 999);
  
  return toZonedTime(endOfFriday, TIME_ZONE);
};

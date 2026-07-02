/**
 * Simulates an API call that returns a list of dates blocked by the admin.
 * Returns an array of YYYY-MM-DD strings.
 */
export const fetchBlockedDates = (): string[] => {
  const blockedDates: string[] = [];
  const today = new Date();
  
  // Simüle edilmiş kapalı tarihler: Bugünden 3 gün, 7 gün ve 8 gün sonrası
  const date1 = new Date(today);
  date1.setDate(date1.getDate() + 3);
  blockedDates.push(date1.toISOString().split('T')[0]);

  const date2 = new Date(today);
  date2.setDate(date2.getDate() + 7);
  blockedDates.push(date2.toISOString().split('T')[0]);

  const date3 = new Date(today);
  date3.setDate(date3.getDate() + 8);
  blockedDates.push(date3.toISOString().split('T')[0]);

  return blockedDates;
};

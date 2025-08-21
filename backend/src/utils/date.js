
export const isFridayNow = () => {
  const now = new Date();
  return now.getUTCDay() === 5; // 5 = Friday in UTC
};

export const getEndOfFriday = () => {
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);
  return end;
};

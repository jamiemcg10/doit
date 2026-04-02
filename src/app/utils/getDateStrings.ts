const DAY = 24 * 60 * 60 * 1000;

export function getPrevDateString(date: string) {
  const currentDate = new Date(`${date}T00:00`);
  const prevDateValue = currentDate.valueOf() - DAY;

  const prevDate = new Date(prevDateValue);

  return prevDate.toLocaleDateString('en-CA');
}

export function getNextDateString(date: string) {
  const currentDate = new Date(`${date}T00:00`);
  const nextDateValue = currentDate.valueOf() + DAY;

  const nextDate = new Date(nextDateValue);

  return nextDate.toLocaleDateString('en-CA');
}

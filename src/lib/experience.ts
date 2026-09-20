/** Career start year used for “X+ years” experience copy. */
export const CAREER_START_YEAR = 2023;

/**
 * Years of experience derived from the calendar year.
 * Updates automatically each January (e.g. 2023 → 2026 = 3+).
 */
export function yearsOfExperience(now = new Date()) {
  const years = now.getUTCFullYear() - CAREER_START_YEAR;
  return Math.max(1, years);
}

export function yearsOfExperienceLabel(now = new Date()) {
  return `${yearsOfExperience(now)}+`;
}

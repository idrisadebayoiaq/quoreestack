/** Career start year used for “X+ years” experience copy. */
export const CAREER_START_YEAR = 2023;

export function yearsOfExperience(now = new Date()) {
  const years = now.getFullYear() - CAREER_START_YEAR;
  return Math.max(1, years);
}

export function yearsOfExperienceLabel(now = new Date()) {
  return `${yearsOfExperience(now)}+`;
}

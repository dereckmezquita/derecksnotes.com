export const REPORT_REASONS = [
  'spam',
  'harassment',
  'misinformation',
  'other'
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export function isValidReportReason(s: string): s is ReportReason {
  return (REPORT_REASONS as readonly string[]).includes(s);
}

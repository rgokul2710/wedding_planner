export const DOCUMENT_CATEGORIES = [
  'Vendor Quotation',
  'Contract',
  'Bill',
  'Receipt',
  'Invitation Design',
  'Venue Document',
  'Marriage Document',
  'Other',
] as const

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Opens the browser print dialog (Save as PDF). Hide chrome with Tailwind `print:hidden`. */
export function printReportAsPdf(documentTitle: string) {
  const previous = document.title;
  document.title = documentTitle;
  window.print();
  window.setTimeout(() => {
    document.title = previous;
  }, 400);
}

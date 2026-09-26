import * as XLSX from "xlsx";

export type ExcelSheetInput = {
  name: string;
  rows: Record<string, unknown>[] | unknown[][];
};

/** Download a multi-sheet .xlsx workbook (client-side). */
export function downloadExcelWorkbook(baseFilename: string, sheets: ExcelSheetInput[]) {
  if (!sheets.length) return;
  const wb = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const safeName = sheet.name.replace(/[\\/?*[\]]/g, "").slice(0, 31) || "Sheet";
    const ws =
      sheet.rows.length > 0 && Array.isArray(sheet.rows[0])
        ? XLSX.utils.aoa_to_sheet(sheet.rows as unknown[][])
        : XLSX.utils.json_to_sheet((sheet.rows as Record<string, unknown>[]) || []);
    XLSX.utils.book_append_sheet(wb, ws, safeName);
  }
  const filename = baseFilename.endsWith(".xlsx") ? baseFilename : `${baseFilename}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/** Single-sheet export from row objects. */
export function downloadExcelRows(baseFilename: string, sheetName: string, rows: Record<string, unknown>[]) {
  downloadExcelWorkbook(baseFilename, [{ name: sheetName, rows }]);
}

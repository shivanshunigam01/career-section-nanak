import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  onExcel: () => void;
  onPdf: () => void;
  excelDisabled?: boolean;
  pdfDisabled?: boolean;
  className?: string;
};

/** Excel download + Print/PDF for admin report modules. */
export function ReportExportButtons({
  onExcel,
  onPdf,
  excelDisabled,
  pdfDisabled,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 print:hidden", className)}>
      <Button type="button" variant="outline" size="sm" onClick={onExcel} disabled={excelDisabled}>
        <FileSpreadsheet className="w-4 h-4 mr-1.5" />
        Excel
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onPdf} disabled={pdfDisabled}>
        <FileText className="w-4 h-4 mr-1.5" />
        PDF
      </Button>
    </div>
  );
}

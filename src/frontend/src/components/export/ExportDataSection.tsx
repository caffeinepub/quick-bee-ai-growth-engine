import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, FileSpreadsheet, FileType, Loader2 } from 'lucide-react';
import { useExportData } from '../../hooks/useExportData';
import { generateCSV } from '../../utils/export/exportCsv';
import { generateXLSX } from '../../utils/export/exportXlsx';
import { generatePDF } from '../../utils/export/exportPdf';
import { generateDOCX } from '../../utils/export/exportDocx';
import { downloadBlob } from '../../utils/export/download';
import { generateFilename } from '../../utils/export/filename';
import { toast } from 'sonner';

export function ExportDataSection() {
  const { data: exportData, isLoading } = useExportData();
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  const handleExportPDF = async () => {
    if (!exportData) return;
    
    setExportingFormat('pdf');
    try {
      const blob = generatePDF(exportData);
      const filename = `${generateFilename('export')}.html`;
      downloadBlob(blob, filename);
      toast.success('PDF-ready HTML downloaded! Open the file and use your browser\'s "Print to PDF" feature.');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setExportingFormat(null);
    }
  };

  const handleExportDOCX = async () => {
    if (!exportData) return;
    
    setExportingFormat('docx');
    try {
      const blob = await generateDOCX(exportData);
      const filename = `${generateFilename('export')}.rtf`;
      downloadBlob(blob, filename);
      toast.success('RTF document downloaded! This file can be opened in Microsoft Word.');
    } catch (error) {
      console.error('DOCX export error:', error);
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setExportingFormat(null);
    }
  };

  const handleExportCSV = () => {
    if (!exportData) return;
    
    setExportingFormat('csv');
    try {
      const csv = generateCSV(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const filename = `${generateFilename('export')}.csv`;
      downloadBlob(blob, filename);
      toast.success('CSV downloaded successfully!');
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error('Failed to generate CSV. Please try again.');
    } finally {
      setExportingFormat(null);
    }
  };

  const handleExportExcel = () => {
    if (!exportData) return;
    
    setExportingFormat('xlsx');
    try {
      const buffer = generateXLSX(exportData);
      const blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
      const filename = `${generateFilename('export')}.xls`;
      downloadBlob(blob, filename);
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to generate Excel file. Please try again.');
    } finally {
      setExportingFormat(null);
    }
  };

  const totalRecords = exportData
    ? exportData.leads.length + exportData.outreach.length + exportData.services.length + exportData.deals.length + exportData.projects.length
    : 0;

  return (
    <Card className="interactive-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileDown className="h-5 w-5" />
          Export Data
        </CardTitle>
        <CardDescription className="text-base">
          Download your Quick Bee data in various formats. Files can be shared manually on WhatsApp or any other platform.
          {totalRecords > 0 && (
            <span className="block mt-2 text-sm font-medium text-foreground">
              {totalRecords} total records available for export
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : totalRecords === 0 ? (
          <div className="text-center py-12 text-muted-foreground space-y-2">
            <p className="text-base">No data available to export yet.</p>
            <p className="text-sm">Start by adding leads, services, or other data to your Quick Bee account.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              onClick={handleExportPDF}
              disabled={exportingFormat !== null}
              variant="outline"
              className="h-auto flex-col gap-3 py-5 focus-ring hover:border-primary/50"
            >
              {exportingFormat === 'pdf' ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <FileText className="h-7 w-7" />
              )}
              <div className="space-y-1">
                <span className="font-semibold text-base">Download PDF</span>
                <span className="text-xs text-muted-foreground block">Print-ready HTML</span>
              </div>
            </Button>

            <Button
              onClick={handleExportDOCX}
              disabled={exportingFormat !== null}
              variant="outline"
              className="h-auto flex-col gap-3 py-5 focus-ring hover:border-primary/50"
            >
              {exportingFormat === 'docx' ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <FileType className="h-7 w-7" />
              )}
              <div className="space-y-1">
                <span className="font-semibold text-base">Download DOCX</span>
                <span className="text-xs text-muted-foreground block">RTF for Word</span>
              </div>
            </Button>

            <Button
              onClick={handleExportCSV}
              disabled={exportingFormat !== null}
              variant="outline"
              className="h-auto flex-col gap-3 py-5 focus-ring hover:border-primary/50"
            >
              {exportingFormat === 'csv' ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-7 w-7" />
              )}
              <div className="space-y-1">
                <span className="font-semibold text-base">Download CSV</span>
                <span className="text-xs text-muted-foreground block">Google Sheets</span>
              </div>
            </Button>

            <Button
              onClick={handleExportExcel}
              disabled={exportingFormat !== null}
              variant="outline"
              className="h-auto flex-col gap-3 py-5 focus-ring hover:border-primary/50"
            >
              {exportingFormat === 'xlsx' ? (
                <Loader2 className="h-7 w-7 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-7 w-7" />
              )}
              <div className="space-y-1">
                <span className="font-semibold text-base">Download Excel</span>
                <span className="text-xs text-muted-foreground block">XLS format</span>
              </div>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

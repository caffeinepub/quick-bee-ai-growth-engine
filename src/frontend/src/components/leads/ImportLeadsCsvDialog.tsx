import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useImportLeads } from '../../hooks/useLeads';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { toast } from 'sonner';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseCsvToLeads } from '../../utils/leads/csv';

interface ImportLeadsCsvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportLeadsCsvDialog({ open, onOpenChange }: ImportLeadsCsvDialogProps) {
  const { data: profile } = useGetCallerUserProfile();
  const importLeads = useImportLeads();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ created: number; failed: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file || !profile?.agency) {
      toast.error('Please select a file and ensure you have a profile');
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const { leads, errors } = parseCsvToLeads(text, profile.agency, profile.name);

      if (leads.length === 0) {
        toast.error('No valid leads found in CSV file');
        setResult({ created: 0, failed: errors.length, errors });
        setImporting(false);
        return;
      }

      await importLeads.mutateAsync({ leads });
      
      setResult({ created: leads.length, failed: errors.length, errors });
      toast.success(`Successfully imported ${leads.length} leads`);
      
      if (errors.length === 0) {
        setTimeout(() => onOpenChange(false), 2000);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to import leads');
      setResult({ created: 0, failed: 1, errors: [error.message || 'Import failed'] });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Leads from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with columns: name, contact, city, niche, status, revenuePotential
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={importing}
            />
          </div>

          {file && !result && (
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Ready to import: {file.name}
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-2">
              {result.created > 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Successfully imported {result.created} lead{result.created !== 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>
              )}
              
              {result.failed > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-1">
                      {result.failed} row{result.failed !== 1 ? 's' : ''} failed to import:
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1 max-h-32 overflow-y-auto">
                      {result.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {!result && (
            <Button onClick={handleImport} disabled={!file || importing}>
              {importing ? 'Importing...' : 'Import Leads'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

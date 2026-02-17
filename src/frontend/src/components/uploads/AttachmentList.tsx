import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, X, FileText, Image } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface AttachmentListProps {
  files: ExternalBlob[];
  onRemove?: (index: number) => void;
}

export function AttachmentList({ files, onRemove }: AttachmentListProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const handlePreview = (blob: ExternalBlob) => {
    const url = blob.getDirectURL();
    if (isImage(url)) {
      setPreviewUrl(url);
    }
  };

  const handleDownload = async (blob: ExternalBlob, index: number) => {
    try {
      const url = blob.getDirectURL();
      const link = document.createElement('a');
      link.href = url;
      link.download = `attachment-${index + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No attachments</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {files.map((file, index) => {
          const url = file.getDirectURL();
          const isImg = isImage(url);
          
          return (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {isImg ? (
                      <Image className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Attachment {index + 1}</p>
                    <p className="text-xs text-muted-foreground">{isImg ? 'Image' : 'Document'}</p>
                  </div>
                  <div className="flex gap-1">
                    {isImg && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(file)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file, index)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {onRemove && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl">
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

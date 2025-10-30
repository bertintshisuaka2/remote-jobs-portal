import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Download, Eye, FileText, Printer } from "lucide-react";
import { useEffect, useState } from "react";

interface DocumentEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  markdownUrl: string;
  title: string;
}

export default function DocumentEditor({ open, onOpenChange, markdownUrl, title }: DocumentEditorProps) {
  const [markdown, setMarkdown] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && markdownUrl) {
      setLoading(true);
      fetch(markdownUrl)
        .then(res => res.text())
        .then(text => {
          setMarkdown(text);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load markdown:", err);
          setLoading(false);
        });
    }
  }, [open, markdownUrl]);

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    alert('Document copied to clipboard!');
  };

  const printDocument = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
            }
            h1, h2, h3 { color: #333; }
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${markdown}</pre>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title} - Editor</DialogTitle>
          <DialogDescription>
            Edit the document below. Changes are temporary - download or print to save.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={showPreview ? "outline" : "default"}
            size="sm"
            onClick={() => setShowPreview(false)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading document...</p>
            </div>
          ) : showPreview ? (
            <div className="prose max-w-none">
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Arial, sans-serif' }}>
                {markdown}
              </pre>
            </div>
          ) : (
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[500px] font-mono text-sm border-0 focus-visible:ring-0"
              placeholder="Edit your document here..."
            />
          )}
        </div>

        <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <FileText className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button variant="outline" size="sm" onClick={downloadMarkdown}>
              <Download className="w-4 h-4 mr-2" />
              Download .md
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={printDocument}>
              <Printer className="w-4 h-4 mr-2" />
              Print to PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


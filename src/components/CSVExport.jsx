import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CSVExport({ data, filename, label = "Export CSV" }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).filter(k => !['id', 'created_by', 'updated_date', 'created_date', 'audit_id', 'zone_id'].includes(k));
    const csvRows = [headers.join(',')];
    data.forEach(row => {
      const values = headers.map(h => {
        const val = row[h] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={!data?.length} className="text-xs">
      <Download className="w-3.5 h-3.5 mr-1.5" />
      {label}
    </Button>
  );
}
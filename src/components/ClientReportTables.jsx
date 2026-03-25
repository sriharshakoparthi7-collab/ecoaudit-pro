export default function ClientReportTables({ items, groupBy }) {
  const groupKey = groupBy === 'category' ? 'category' : 'zone';

  // Group items
  const groups = {};
  items.forEach(item => {
    const key = item[groupKey];
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  const sortedGroups = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));

  if (!sortedGroups.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">No equipment data recorded for this audit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedGroups.map(([groupName, groupItems]) => {
        const subtotal = groupItems.reduce((s, i) => s + (i.value || 0), 0);
        const hasValues = groupItems.some(i => i.value > 0);
        const unit = groupItems[0]?.value_unit;

        return (
          <div key={groupName} className="report-section">
            {/* Group Header */}
            <div className="flex items-end justify-between mb-3 pb-2 border-b-2 border-primary/20">
              <h3 className="text-base font-bold text-foreground">{groupName}</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">{groupItems.length} {groupItems.length === 1 ? 'item' : 'items'}</span>
                {hasValues && subtotal > 0 && (
                  <span className="font-semibold text-primary">{subtotal.toFixed(2)} {unit}</span>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Item</th>
                    {groupBy === 'category' && (
                      <th className="px-4 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Zone / Location</th>
                    )}
                    {groupBy === 'zone' && (
                      <th className="px-4 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Category</th>
                    )}
                    <th className="px-4 py-3 text-right font-semibold text-foreground text-xs uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {groupItems.map((item, i) => (
                    <tr key={item.id} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                      <td className="px-4 py-3 font-medium text-foreground">{item.item_name}</td>
                      {groupBy === 'category' && (
                        <td className="px-4 py-3 text-muted-foreground">{item.zone}</td>
                      )}
                      {groupBy === 'zone' && (
                        <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                      )}
                      <td className="px-4 py-3 text-right text-foreground">
                        {item.value > 0 ? `${item.value.toFixed(2)} ${item.value_unit}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">
                        {item.notes || '—'}
                      </td>
                    </tr>
                  ))}
                  {/* Subtotal row */}
                  {hasValues && subtotal > 0 && (
                    <tr className="bg-primary/5 border-t border-primary/20">
                      <td colSpan={groupBy === 'category' ? 2 : 2} className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">
                        Subtotal
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-primary text-sm">
                        {subtotal.toFixed(2)} {unit}
                      </td>
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
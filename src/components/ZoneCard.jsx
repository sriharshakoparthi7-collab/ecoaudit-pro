import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ZoneCard({ zone, auditId, onDelete }) {
  return (
    <div className="group bg-card rounded-xl border border-border hover:shadow-md hover:border-primary/30 transition-all duration-300">
      <Link to={`/audit/${auditId}/zone/${zone.id}`} className="block p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-foreground truncate">{zone.zone_name}</h4>
              {zone.zone_description && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">{zone.zone_description}</p>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </div>
      </Link>
      <div className="px-4 pb-3 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            onDelete(zone.id);
          }}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
}
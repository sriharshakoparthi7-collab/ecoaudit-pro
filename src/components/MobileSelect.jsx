import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
}

export default function MobileSelect({ value, onValueChange, placeholder, options }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const label = options.find(o => o.value === value)?.label || placeholder || 'Select…';

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              {placeholder && (
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-2">{placeholder}</p>
              )}
              <div className="px-3 pb-3 space-y-0.5">
                {options.map(o => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => { onValueChange(o.value); setOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl flex items-center justify-between hover:bg-muted active:bg-muted transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{o.label}</span>
                    {value === o.value && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
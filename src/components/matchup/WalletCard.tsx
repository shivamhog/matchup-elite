import { useState } from "react";
import { Lock, Plus, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/matchup/pricing";
import { useStore } from "@/lib/matchup/store";

const QUICK = [200, 500, 1000, 2000];

export function WalletCard() {
  const { state, addMoney } = useStore();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("500");
  const [upi, setUpi] = useState("rahul@okaxis");

  const submit = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 50 || value > 50000) {
      toast.error("Enter an amount between ₹50 and ₹50,000");
      return;
    }
    if (!/^[\w.\-]{2,50}@[a-zA-Z]{2,20}$/.test(upi.trim())) {
      toast.error("Enter a valid UPI ID (e.g. name@bank)");
      return;
    }
    addMoney(value);
    setOpen(false);
    toast.success(`${formatINR(value)} added to your MatchUp wallet`);
  };

  return (
    <div className="rounded-3xl border border-primary/25 bg-card p-5 neon-glow">
      <div className="flex items-start justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            <Wallet className="size-3.5" /> MatchUp wallet
          </p>
          <p className="mt-2 text-4xl font-black tracking-tight text-primary text-glow">
            {formatINR(state.balance)}
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" /> {formatINR(state.escrow)} locked in escrow
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-semibold">
              <Plus className="size-4" /> Add money
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add money via UPI</DialogTitle>
              <DialogDescription>
                Demo checkout — no real payment is processed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className="rounded-lg border border-border bg-surface py-2 text-xs font-semibold transition-colors hover:border-primary/60 data-[on=true]:border-primary data-[on=true]:text-primary"
                    data-on={amount === String(q)}
                  >
                    ₹{q}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="amt">Amount (₹)</Label>
                <Input
                  id="amt"
                  inputMode="numeric"
                  value={amount}
                  maxLength={6}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="upi">UPI ID</Label>
                <Input
                  id="upi"
                  value={upi}
                  maxLength={50}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="name@bank"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submit} className="w-full font-semibold">
                Pay {formatINR(Number(amount) || 0)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

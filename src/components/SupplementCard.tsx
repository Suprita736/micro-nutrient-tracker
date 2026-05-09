import { Supplement } from "@/data/supplements";
import { useTrackingStore } from "@/store/trackingStore";

interface Props {
    supplement: Supplement;
}

export default function SupplementCard({ supplement }: Props) {
    const supplements = useTrackingStore((s) => s.supplements);
    const updateSupplement = useTrackingStore((s) => s.updateSupplement);

    const value = supplements[supplement.id] || 0;

    return (
        <div className="border border-border rounded-xl p-4 bg-card">
            <h3 className="font-semibold">{supplement.name}</h3>

            <div className="flex items-center gap-2 mt-3">
                <input
                    type="number"
                    value={value === 0 ? "" : value}
                    placeholder="0"
                    onChange={(e) =>
                        updateSupplement(
                            supplement.id,
                            Number(e.target.value)
                        )
                    }
                    className="w-24 px-2 py-1 rounded-md bg-background border border-border"
                />

                <span className="text-sm text-muted-foreground">
                    {supplement.unit}
                </span>
            </div>
        </div>
    );
}
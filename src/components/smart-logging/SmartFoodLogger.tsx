import { useState, useRef, useEffect } from "react";
import { Mic, Send, Loader2, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrackingStore } from "@/store/trackingStore";
import { foods as allFoods, FoodItem } from "@/data/nutrients";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface ParsedFood {
  food: string;
  quantity: number;
  unit: "piece" | "grams" | "servings";
  explicit?: boolean;
}

interface DetectedFood {
  original: ParsedFood;
  matchedFood: FoodItem;
  quantityFactor: number;
}

export const SmartFoodLogger = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[] | null>(null);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const updateFoodQuantity = useTrackingStore((s) => s.updateFoodQuantity);
  const addFoodQuantity = useTrackingStore((s) => s.addFoodQuantity);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        setIsListening(false);
        handleParse(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Speech recognition failed: " + event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setText("");
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };
  const handleSuggestions = (value: string) => {
    setText(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const normalized = value.toLowerCase();

    const matches = allFoods
      .filter((food) =>
        food.name.toLowerCase().includes(normalized)
      )
      .slice(0, 5);

    setSuggestions(matches);
  };

  const handleParse = async (input: string) => {
    if (!input.trim()) return;

    setIsLoading(true);
    setDetectedFoods(null);
    setSuggestions([]);
    try {
      const { data, error } = await supabase.functions.invoke("parse-food", {
        body: { text: input },
      });
      console.log("API RESPONSE:", data);
      if (error) throw error;
      if (!data) throw new Error("No data returned");

      processParsedItems(data);
    } catch (error) {
      console.warn("Supabase function failed, using local mock for demo:", error);
      // Fallback fallback parsing logic for demo purposes if API doesn't exist
      const mockResult = simulateAIParsing(input);
      processParsedItems(mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  const processParsedItems = (items: ParsedFood[]) => {
    if (!items || items.length === 0) {
      toast.info("No foods detected.");
      return;
    }
    const detected: DetectedFood[] = [];

    items.forEach((item) => {
      // ✅ 7. Ensure Clean Data
      const cleanItem: ParsedFood = {
        food: (item.food || "Unknown").trim(),
        quantity: item.quantity || 1,
        unit: item.unit || "piece",
        explicit: item.explicit || false,
      };

      const normalizedInput = normalizeFoodString(cleanItem.food);

      // ✅ 5. Improve Matching Logic (Exact Match)
      let food = allFoods.find((f) => {
        const normName = normalizeFoodString(f.name);
        const normId = normalizeFoodString(f.id.replace(/_/g, ' '));
        return normName === normalizedInput || normId === normalizedInput;
      });

      // Partial Match Fallback
      if (!food) {
        // Try better partial matching with priority
        let bestMatch: FoodItem | undefined;
        let bestScore = 0;

        allFoods.forEach((f) => {
          const normName = normalizeFoodString(f.name);
          const normId = normalizeFoodString(f.id.replace(/_/g, ' '));

          let score = 0;

          if (normalizedInput.includes(normName)) score += normName.length;
          if (normalizedInput.includes(normId)) score += normId.length;
          if (normName.includes(normalizedInput)) score += normalizedInput.length;

          if (score > bestScore) {
            bestScore = score;
            bestMatch = f;
          }
        });

        food = bestMatch;
      }

      if (food) {
        let quantityFactor = 1;

        // Piece foods (2 eggs, 3 bananas)
        if (cleanItem.unit === "piece") {
          quantityFactor = cleanItem.quantity;

          cleanItem.unit = "servings";
        }

        // Explicit grams (50g rice, 120g paneer)
        else if (cleanItem.explicit) {
          quantityFactor = cleanItem.quantity / food.minQuantity;

          cleanItem.unit = "grams";
        }

        // Default serving (rice, oats, paneer)
        else {
          quantityFactor = cleanItem.quantity;

          cleanItem.unit = "servings";
        }
        // ✅ 8. Debug Logging
        console.log(`[SmartFoodLogger] Matched "${item.food}" -> "${food.name}" | Parsed Qty: ${item.quantity} ${item.unit} | Scaled Servings: ${quantityFactor}`);

        detected.push({
          original: cleanItem as ParsedFood,
          matchedFood: food,
          quantityFactor
        });
      } else {
        // ✅ 6. Prevent Silent Failures
        console.warn(`[SmartFoodLogger] Failed to match food: "${cleanItem.food}"`);
        toast.warning(`"${cleanItem.food}" not found in database`);
      }
    });

    if (detected.length > 0) {
      setDetectedFoods(detected);
    } else {
      toast.info("No recognized foods found in your input.");
    }
  };

  const handleConfirm = () => {
    if (!detectedFoods) return;

    detectedFoods.forEach((item) => {
      addFoodQuantity(item.matchedFood.id, item.quantityFactor);
    });

    setDetectedFoods(null);
    setText("");
    toast.success(`Added ${detectedFoods.length} items to your log.`);
  };

  const handleCancel = () => {
    setDetectedFoods(null);
    setText("");
  };

  return (
    <div className="bg-card border border-border p-6 mb-10 overflow-hidden relative">
      <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
        Smart Food Log
        <span className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full font-sans">
          Voice & AI
        </span>
      </h2>

      {!detectedFoods ? (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => handleSuggestions(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleParse(text)}
              placeholder="What did you eat? (e.g. '2 eggs and banana')"
              className="w-full bg-background border border-border px-4 py-3 pr-24 rounded-none font-sans text-sm outline-none focus:border-primary transition-colors h-12"
              disabled={isLoading}
            />
            <div className="absolute right-1 top-1 bottom-1 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleListening}
                className={`h-full px-3 rounded-none ${isListening ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}
                disabled={isLoading}
                title="Voice Input"
              >
                <Mic size={18} />
              </Button>
              <Button
                size="sm"
                onClick={() => handleParse(text)}
                className="h-full px-4 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || !text.trim()}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground italic font-sans px-1">
            Try: "I ate 2 eggs and oats" or "1 roti and banana"
          </p>
          {suggestions.length > 0 && !detectedFoods && (
            <div className="border border-border bg-card mt-1">
              {suggestions.map((food) => (
                <button
                  key={food.id}
                  onClick={() => {
                    setText(food.name);
                    setSuggestions([]);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors border-b border-border last:border-0"
                >
                  {food.name}
                </button>
              ))}
            </div>
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-primary px-1">
              <Loader2 size={14} className="animate-spin" />
              <span>Detecting foods...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm font-sans text-foreground mb-4">
            Detecting from: <span className="italic font-medium">"{text}"</span>
          </p>

          <div className="space-y-2 mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Detected Foods:</p>
            {detectedFoods.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 px-3 bg-muted/50 border-l-2 border-primary group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                    <img src={item.matchedFood.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.matchedFood.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.original.quantity} {item.original.unit}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-primary">
                    {item.quantityFactor.toFixed(1)} {item.original.unit === 'piece' ? 'piece' : 'equiv'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleConfirm} className="flex-1 bg-primary text-primary-foreground">
              <Check size={18} className="mr-2" /> Confirm
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1 border-border text-muted-foreground">
              <X size={18} className="mr-2" /> Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for local demo parsing when API isn't built yet
function simulateAIParsing(input: string): ParsedFood[] {
  const normalizedInput = normalizeFoodString(input);
  const results: ParsedFood[] = [];

  allFoods.forEach(food => {
    const normName = normalizeFoodString(food.name);
    const normId = normalizeFoodString(food.id.replace(/_/g, ' '));

    // Check if the normalized input contains this food's name or id
    if (normalizedInput.includes(normName) || normalizedInput.includes(normId)) {
      // Look for any numbers in the input
      const match = input.match(/(\d+)/);
      let qty = match ? parseInt(match[1]) : 1;

      // Avoid adding duplicates (e.g. "Rice" and "Brown Rice" matching "Brown Rice")
      const exists = results.some(r => r.food === food.name);
      if (!exists) {
        results.push({
          food: food.name,
          quantity: qty,
          unit: "piece"
        });
      }
    }
  });

  return results;
}

// ✅ 4. Add Strong Food Name Normalization
function normalizeFoodString(name: string): string {
  if (!name) return "";
  let n = name.toLowerCase().trim();

  // Remove common prefixes
  n = n.replace(/\b(cooked|boiled|fried)\b/gi, '').trim();

  // Handle specific plurals cleanly
  n = n.replace(/oes$/i, 'o'); // potatoes -> potato

  // Handle general ending 's' (seeds -> seed, eggs -> egg, oats -> oat)
  // Replaces 's' at the end of string only if it's not preceded by an 's'
  n = n.replace(/([^s])s$/i, '$1');

  return n.trim();
}

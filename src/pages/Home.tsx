import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const STORAGE_KEY = "blox_redirect_url";

const FRUITS = [
  { id: 1, name: "🦖 T-Rex", image: "https://i.ibb.co.com/4RjB9N0k/T-Rex-Fruit.webp" },
  { id: 2, name: "🦊 Kitsune", image: "https://i.ibb.co.com/cSMWSPc0/Kitsune-bf.webp" },
  { id: 3, name: "🐯 Leopard", image: "https://i.ibb.co.com/wnChysN/Leopard.webp" },
  { id: 4, name: "👾 Yeti", image: "https://i.ibb.co.com/3yDLGN6y/Yeti.webp" },
  { id: 5, name: "🐉 East Dragon", image: "https://i.ibb.co.com/TqKnzjQs/East-Dragon.webp" },
  { id: 6, name: "🐲 West Dragon", image: "https://i.ibb.co.com/m5SZ2BJm/West-Dragon.webp" },
];

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [winningFruit, setWinningFruit] = useState<typeof FRUITS[0] | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const { toast } = useToast();
  const spinInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (spinInterval.current) {
        clearInterval(spinInterval.current);
      }
    };
  }, []);

  const handleGenerate = async () => {
    if (!username.trim()) {
      toast({
        title: "⚠️ Please enter your Roblox username first!",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    try {
      const res = await fetch(`/api/check-username?username=${encodeURIComponent(username.trim())}`);
      const data = await res.json() as { exists: boolean };
      if (!data.exists) {
        toast({
          title: "❌ Username not found!",
          description: `"${username.trim()}" does not exist on Roblox. Please check and try again.`,
          variant: "destructive",
        });
        setIsChecking(false);
        return;
      }
    } catch {
      toast({
        title: "⚠️ Could not verify username",
        description: "Unable to reach Roblox. Please check your connection and try again.",
        variant: "destructive",
      });
      setIsChecking(false);
      return;
    }
    setIsChecking(false);
    setIsSpinning(true);
    let currentIndex = 0;
    
    spinInterval.current = setInterval(() => {
      setHighlightedIndex(currentIndex % FRUITS.length);
      currentIndex++;
    }, 150);

    setTimeout(() => {
      if (spinInterval.current) {
        clearInterval(spinInterval.current);
      }
      
      const winnerIndex = Math.floor(Math.random() * FRUITS.length);
      setHighlightedIndex(winnerIndex);
      setWinningFruit(FRUITS[winnerIndex]);
      
      setTimeout(() => {
        setIsSpinning(false);
        setShowCongrats(true);
        
        setTimeout(() => {
          setShowCongrats(false);
          setShowRedirect(true);

          const url = localStorage.getItem(STORAGE_KEY)?.trim();
          if (url) {
            setTimeout(() => {
              window.location.href = url;
            }, 2000);
          } else {
            setTimeout(() => {
              setShowRedirect(false);
              setHighlightedIndex(null);
              setWinningFruit(null);
            }, 4000);
          }
        }, 3000);
      }, 500);
      
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: "url('/bg.webp')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      
      {showWelcome && (
        <div data-testid="overlay-welcome" className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-out fade-out duration-1000 delay-[6000ms] fill-mode-forwards">
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] mb-4 text-center">
            👒Welcome to Blox Fruits👒
          </h1>
          <p className="text-xl md:text-2xl text-cyan-200 animate-pulse">
            ✨ Fruits Generator Adventure ✨
          </p>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute text-2xl animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {['👾', '🐉', '🐯', '✨', '👒'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        </div>
      )}

      {showCongrats && winningFruit && (
        <div data-testid="overlay-congrats" className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="animate-bounce flex flex-col items-center">
            <div className="w-64 h-64 relative mb-8 rounded-full shadow-[0_0_50px_rgba(34,211,238,0.6)] bg-cyan-950/30 p-8">
              <img src={winningFruit.image} alt={winningFruit.name} className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] text-center px-4">
              🎉 Congratulations! You got {winningFruit.name} 🎉
            </h2>
          </div>
        </div>
      )}

      {showRedirect && (
        <div data-testid="overlay-redirect" className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <h2 className="text-3xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse text-center">
            🔗 Redirecting to Private Server...
          </h2>
        </div>
      )}

      <div className="w-full max-w-2xl flex flex-col items-center space-y-8 z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
            👒Blox Fruits👒
          </h1>
          <h2 className="text-xl md:text-2xl text-cyan-200">
            ✨ Fruits Generator ✨
          </h2>
        </div>

        <div className="w-full max-w-md">
          <Input
            data-testid="input-username"
            type="text"
            placeholder="Enter your Roblox Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSpinning}
            className="w-full border-cyan-500/50 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/50 bg-black/50 text-cyan-100 placeholder:text-cyan-800 text-center text-lg h-12"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
          {FRUITS.map((fruit, index) => (
            <div
              key={fruit.id}
              data-testid={`card-fruit-${index}`}
              className={`
                relative flex flex-col items-center p-4 rounded-xl transition-all duration-200
                bg-black/60 border border-cyan-900/50
                ${highlightedIndex === index 
                  ? 'scale-110 border-cyan-400 border-[3px] shadow-[0_0_30px_rgba(34,211,238,0.8)] z-20' 
                  : 'shadow-[0_0_10px_rgba(34,211,238,0.1)] hover:border-cyan-700'}
              `}
            >
              <div className="w-24 h-24 mb-3">
                <img src={fruit.image} alt={fruit.name} className="w-full h-full object-contain" />
              </div>
              <span className={`font-semibold ${highlightedIndex === index ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-cyan-600'}`}>
                {fruit.name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button
            data-testid="button-generate"
            onClick={handleGenerate}
            disabled={isSpinning || isChecking}
            className="w-full h-14 text-xl font-bold bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all disabled:opacity-80"
          >
            {isChecking ? "Checking username..." : isSpinning ? "Generating..." : "Generate"}
          </Button>

          <Button
            data-testid="button-youtube"
            variant="destructive"
            onClick={() => {
              const url = localStorage.getItem("blox_youtube_url")?.trim();
              if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
              } else {
                toast({
                  title: "⚠️ No tutorial link set yet.",
                  description: "Check back soon!",
                });
              }
            }}
            disabled={isSpinning || isChecking}
            className="w-full font-bold bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            🎥 Watch Tutorial on YouTube
          </Button>
        </div>

        <Collapsible
          open={isDescriptionOpen}
          onOpenChange={setIsDescriptionOpen}
          className="w-full max-w-2xl bg-black/40 border border-cyan-900/30 rounded-lg overflow-hidden backdrop-blur-sm"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex justify-between items-center p-4 h-auto hover:bg-cyan-950/30 text-cyan-200 rounded-none">
              <span className="font-semibold text-lg">ℹ️ Description</span>
              {isDescriptionOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 text-cyan-100/80 leading-relaxed text-sm md:text-base">
            🌟 Ahoy, pirates! This website was created specifically for you by the Developers, so you can enjoy unlocking free fruit in Blox Fruits. 💻 The Developers worked tirelessly — long nights, countless trials, and unrelenting effort — until they finally discovered a hidden trick in the game. 🚀 With this method, you can claim rare fruit without spending a single coin. Every click is a reward for the Developers' hard work, created to bring joy to the entire pirate community. 🍏⚔️
          </CollapsibleContent>
        </Collapsible>

      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Save, Eye, EyeOff, CheckCircle } from "lucide-react";

const ADMIN_PASSWORD = "135209179";
const STORAGE_KEY = "blox_redirect_url";
const YOUTUBE_KEY = "blox_youtube_url";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [savedYoutubeUrl, setSavedYoutubeUrl] = useState("");
  const [youtubeSaved, setYoutubeSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) ?? "";
    setSavedUrl(stored);
    setRedirectUrl(stored);
    const storedYt = localStorage.getItem(YOUTUBE_KEY) ?? "";
    setSavedYoutubeUrl(storedYt);
    setYoutubeUrl(storedYt);
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword("");
    }
  };

  const handleSave = () => {
    const trimmed = redirectUrl.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setSavedUrl(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRedirectUrl("");
    setSavedUrl("");
    setSaved(false);
  };

  const handleYoutubeSave = () => {
    const trimmed = youtubeUrl.trim();
    localStorage.setItem(YOUTUBE_KEY, trimmed);
    setSavedYoutubeUrl(trimmed);
    setYoutubeSaved(true);
    setTimeout(() => setYoutubeSaved(false), 3000);
  };

  const handleYoutubeClear = () => {
    localStorage.removeItem(YOUTUBE_KEY);
    setYoutubeUrl("");
    setSavedYoutubeUrl("");
    setYoutubeSaved(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <Lock className="w-8 h-8" />
            <p className="text-sm">Admin access required</p>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <Input
                data-testid="input-admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className={`bg-zinc-900 border-zinc-700 text-zinc-100 pr-10 ${passwordError ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-400 text-sm text-center">Incorrect password.</p>
            )}
            <Button
              data-testid="button-admin-login"
              onClick={handleLogin}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-zinc-100">Admin Settings</h1>
          <p className="text-sm text-zinc-500">Configure where users are redirected after generating a fruit.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300">Redirect URL</label>
            {savedUrl && (
              <p className="text-xs text-zinc-500 break-all">
                Current: <span className="text-zinc-400">{savedUrl}</span>
              </p>
            )}
            {!savedUrl && (
              <p className="text-xs text-zinc-600 italic">No redirect URL set — users will see the overlay then stay on page.</p>
            )}
          </div>
          <Input
            data-testid="input-redirect-url"
            type="url"
            placeholder="https://your-link-here.com"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
          />
          <div className="flex gap-3">
            <Button
              data-testid="button-save-url"
              onClick={handleSave}
              disabled={redirectUrl.trim() === savedUrl}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 gap-2"
            >
              {saved ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save"}
            </Button>
            <Button
              data-testid="button-clear-url"
              onClick={handleClear}
              variant="ghost"
              disabled={!savedUrl}
              className="text-zinc-500 hover:text-red-400 hover:bg-red-950/30"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300">YouTube Button URL</label>
            {savedYoutubeUrl && (
              <p className="text-xs text-zinc-500 break-all">
                Current: <span className="text-zinc-400">{savedYoutubeUrl}</span>
              </p>
            )}
            {!savedYoutubeUrl && (
              <p className="text-xs text-zinc-600 italic">No YouTube URL set — button will show a placeholder message.</p>
            )}
          </div>
          <Input
            data-testid="input-youtube-url"
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600"
          />
          <div className="flex gap-3">
            <Button
              data-testid="button-save-youtube"
              onClick={handleYoutubeSave}
              disabled={youtubeUrl.trim() === savedYoutubeUrl}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 gap-2"
            >
              {youtubeSaved ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
              {youtubeSaved ? "Saved!" : "Save"}
            </Button>
            <Button
              data-testid="button-clear-youtube"
              onClick={handleYoutubeClear}
              variant="ghost"
              disabled={!savedYoutubeUrl}
              className="text-zinc-500 hover:text-red-400 hover:bg-red-950/30"
            >
              Clear
            </Button>
          </div>
        </div>

        <p className="text-xs text-zinc-700 text-center">
          This page is not linked anywhere in the public site. Access via /astasuratata
        </p>
      </div>
    </div>
  );
}

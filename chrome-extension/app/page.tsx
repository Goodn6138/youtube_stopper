"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Plus, X } from "lucide-react"

export default function ShortsFilter() {
  const [preferences, setPreferences] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const addPreference = () => {
    if (input.trim() && !preferences.includes(input.trim())) {
      setPreferences([...preferences, input.trim()])
      setInput("")
    }
  }

  const removePreference = (pref: string) => {
    setPreferences(preferences.filter((p) => p !== pref))
  }

  const handleAnalyze = async () => {
    if (preferences.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Sample Video",
          description: preferences.join(", "),
          filter: preferences[0] || "educational content",
        }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPreference()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Shorts Filter</h1>
          </div>
          <p className="text-slate-400 text-sm">Curate your short-form content</p>
        </div>

        {/* Input Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <div className="p-4 space-y-3">
            <label className="block text-sm font-medium text-slate-200">What do you want to see?</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., educational, music, sports..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              />
              <Button onClick={addPreference} size="icon" className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Preferences Tags */}
        {preferences.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <div className="p-4">
              <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">Your Preferences</p>
              <div className="flex flex-wrap gap-2">
                {preferences.map((pref) => (
                  <Badge
                    key={pref}
                    variant="secondary"
                    className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 cursor-pointer flex items-center gap-1"
                    onClick={() => removePreference(pref)}
                  >
                    {pref}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={preferences.length === 0 || isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium mb-6 h-10"
        >
          {isLoading ? "Analyzing..." : "Analyze Content"}
        </Button>

        {/* Results */}
        {result && (
          <Card className="bg-slate-800/50 border-slate-700">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Classification</span>
                <Badge
                  className={`${
                    result.educational
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                  }`}
                >
                  {result.top_label}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Confidence Scores</p>
                {Object.entries(result.all_scores).map(([label, score]: [string, any]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-400 capitalize">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{(score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Info Footer */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Add your content preferences above to get started filtering your shorts
          </p>
        </div>
      </div>
    </div>
  )
}

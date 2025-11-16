'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [animeImage, setAnimeImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setAnimeImage(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)
    setAnimeImage(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate anime character')
      }

      const data = await response.json()
      setAnimeImage(data.output)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setAnimeImage(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            AI Anime Character Generator
          </h1>
          <p className="text-xl text-purple-200">
            Transform yourself into an anime character with AI
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {!selectedImage ? (
            <div className="text-center">
              <div className="mb-8">
                <svg
                  className="mx-auto h-32 w-32 text-purple-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Upload Your Photo
              </h2>
              <p className="text-purple-200 mb-8">
                Choose a clear photo of yourself to get started
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                Choose Photo
              </label>
            </div>
          ) : (
            <div>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 text-center">
                    Original Photo
                  </h3>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <img
                      src={selectedImage}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 text-center">
                    Anime Version
                  </h3>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                    {loading ? (
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mb-4"></div>
                        <p className="text-purple-200">
                          Transforming into anime...
                        </p>
                      </div>
                    ) : animeImage ? (
                      <img
                        src={animeImage}
                        alt="Anime version"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <p className="text-purple-300">
                        Click generate to see your anime version
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Generating...' : 'Generate Anime Version'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload New Photo
                </button>
              </div>

              {animeImage && (
                <div className="mt-6 text-center">
                  <a
                    href={animeImage}
                    download="anime-character.png"
                    className="inline-block bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-all"
                  >
                    Download Anime Image
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-purple-200 text-sm">
          <p>Powered by AI image generation technology</p>
        </div>
      </div>
    </main>
  )
}

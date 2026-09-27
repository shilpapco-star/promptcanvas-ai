"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState("Standard");

  const [imageUrl, setImageUrl] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateImage() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setImageUrl("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          aspectRatio,
          quality,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Image generation failed");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      setImageUrl(url);

      setHistory((previous) => [url, ...previous].slice(0, 6));
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  function useConcept(idea: string) {
    setPrompt(idea);
  }

  return (
    <main className="min-h-screen bg-[#09070f] text-white">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-8 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 font-bold">
            P
          </div>

          <div>
            <h1 className="text-lg font-semibold">
              PromptCanvas AI
            </h1>

            <p className="text-xs text-gray-500">
              AI Image Studio
            </p>
          </div>

        </div>

        <div className="flex items-center gap-4">

          <button className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
            Gallery
          </button>

          <button className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
            My Creations
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold">
            S
          </div>

        </div>

      </header>


      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* Hero */}
        <div className="mb-12 text-center">

          <p className="mb-3 text-sm font-medium text-purple-400">
            ✦ AI IMAGE GENERATOR
          </p>

          <h2 className="text-5xl font-bold tracking-tight">
            Turn your imagination
            <br />
            into{" "}
            <span className="text-purple-400">
              visuals.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-gray-400">
            Describe anything you can imagine and let AI
            transform your words into stunning images.
          </p>

        </div>


        {/* Generator */}
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">

          <div className="mb-3 flex items-center justify-between">

            <label className="text-sm font-medium text-gray-300">
              Describe your image
            </label>

            <span className="text-xs text-gray-500">
              {prompt.length}/500
            </span>

          </div>


          <textarea
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value.slice(0, 500))
            }
            placeholder="A futuristic Bengaluru skyline at night, neon lights, cinematic atmosphere..."
            className="h-36 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-purple-500/50"
          />


          {/* Options */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Style */}
            <div>

              <p className="mb-2 text-xs text-gray-500">
                Style
              </p>

              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111018] px-4 py-3 text-sm outline-none"
              >
                <option>Realistic</option>
                <option>Anime</option>
                <option>Digital Art</option>
                <option>3D Render</option>
                <option>Cinematic</option>
              </select>

            </div>


            {/* Aspect Ratio */}
            <div>

              <p className="mb-2 text-xs text-gray-500">
                Aspect Ratio
              </p>

              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111018] px-4 py-3 text-sm outline-none"
              >
                <option value="1:1">1 : 1</option>
                <option value="16:9">16 : 9</option>
                <option value="4:3">4 : 3</option>
                <option value="9:16">9 : 16</option>
              </select>

            </div>


            {/* Quality */}
            <div>

              <p className="mb-2 text-xs text-gray-500">
                Quality
              </p>

              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111018] px-4 py-3 text-sm outline-none"
              >
                <option>Standard</option>
                <option>High</option>
              </select>

            </div>

          </div>


          {/* Generate Button */}
          <button
            onClick={generateImage}
            disabled={!prompt.trim() || loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-4 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >

            {loading ? (
              <>
                <span className="animate-spin">
                  ◌
                </span>

                Generating...
              </>
            ) : (
              <>
                ✦ Generate Image
              </>
            )}

          </button>

        </div>


        {/* Quick Concepts */}
        <div className="mx-auto mt-12 max-w-4xl">

          <div className="mb-5 flex items-center justify-between">

            <h3 className="font-semibold">
              Quick Concepts
            </h3>

            <span className="text-xs text-gray-500">
              Try an idea
            </span>

          </div>


          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

            {[
              "Cyberpunk city",
              "Fantasy landscape",
              "Minimal workspace",
              "Futuristic robot",
            ].map((idea) => (

              <button
                key={idea}
                onClick={() => useConcept(idea)}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm text-gray-300 transition hover:border-purple-500/40 hover:bg-purple-500/5"
              >

                <div className="mb-3 text-xl">
                  ✦
                </div>

                {idea}

              </button>

            ))}

          </div>

        </div>


        {/* Generated Image */}
        <div className="mx-auto mt-12 max-w-4xl">

          <div className="mb-5 flex items-center justify-between">

            <h3 className="font-semibold">
              Generated Image
            </h3>

            {imageUrl && (
              <a
                href={imageUrl}
                download="promptcanvas-image.png"
                className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
              >
                ↓ Download
              </a>
            )}

          </div>


          <div className="flex min-h-[350px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">

            {loading ? (

              <div className="text-center">

                <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-purple-500" />

                <p className="text-sm text-gray-400">
                  Creating your image...
                </p>

                <p className="mt-2 text-xs text-gray-600">
                  This may take a little while
                </p>

              </div>

            ) : imageUrl ? (

              <img
                src={imageUrl}
                alt={prompt}
                className="max-h-[700px] w-full object-contain"
              />

            ) : error ? (

              <div className="px-6 text-center">

                <p className="text-sm text-red-400">
                  {error}
                </p>

                <p className="mt-2 text-xs text-gray-600">
                  Check the terminal for more details.
                </p>

              </div>

            ) : (

              <div className="text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                  ✦
                </div>

                <p className="text-sm text-gray-400">
                  Your generated image will appear here
                </p>

                <p className="mt-2 text-xs text-gray-600">
                  Enter a prompt above to get started
                </p>

              </div>

            )}

          </div>

        </div>


        {/* Recent Creations */}
        {history.length > 0 && (

          <section className="mx-auto mt-12 max-w-4xl">

            <div className="mb-5">

              <h3 className="text-xl font-semibold">
                Recent Creations
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your latest generated images
              </p>

            </div>


            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

              {history.map((image, index) => (

                <button
                  key={`${image}-${index}`}
                  onClick={() => setImageUrl(image)}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >

                  <img
                    src={image}
                    alt={`Generated image ${index + 1}`}
                    className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                </button>

              ))}

            </div>

          </section>

        )}

      </section>

    </main>
  );
}
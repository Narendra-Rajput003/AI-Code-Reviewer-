"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Prism from "prismjs"; // ✅ Use import instead of require

const Editor = dynamic(() => import("react-simple-code-editor"), { ssr: false });

export default function Home() {
    const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);
    const [review, setReview] = useState("");

    async function reviewCode() {
        try {
            const response = await fetch("/api/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch review");
            }

            const data = await response.json();
            setReview(data.result);
        } catch (error) {
            console.error("Error reviewing code:", error);
            setReview("An error occurred while reviewing the code.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold text-center mb-8">AI Code Reviewer</h1>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Side: Code Editor */}
                <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-lg">
                    <Editor
                        value={code}
                        onValueChange={(code) => setCode(code)}
                        highlight={(code) => Prism.highlight(code, Prism.languages.javascript, "javascript")}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 16,
                            backgroundColor: "#1f2937",
                            color: "#f3f4f6",
                            border: "1px solid #374151",
                            borderRadius: "5px",
                            height: "100%",
                            width: "100%",
                        }}
                    />
                    <button
                        onClick={reviewCode}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Review Code
                    </button>
                </div>

                {/* Right Side: Review Output */}
                <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-lg overflow-y-auto">
                    <Markdown rehypePlugins={[rehypeHighlight]} className="prose prose-invert">
                        {review}
                    </Markdown>
                </div>
            </div>
        </div>
    );
}

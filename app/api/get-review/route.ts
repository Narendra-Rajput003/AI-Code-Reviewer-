import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/serices/ai.service"; // Corrected typo in "services"

export async function POST(req: NextRequest) {
    try {
        
        const { code } = await req.json();

        
        if (!code) {
            return NextResponse.json(
                { error: "No code provided" },
                { status: 400 }
            );
        }

        
        const result = await generateContent(code);

        // Return the result as a JSON response
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);

        // Return an error response if something goes wrong
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
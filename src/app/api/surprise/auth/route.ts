import { NextResponse } from "next/server";
import { isPasswordValid } from "@/lib/surpriseAuth";

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const password = typeof body?.password === "string" ? body.password : "";

    if (!isPasswordValid(password)) {
        return NextResponse.json(
            { error: "Password does not match." },
            { status: 401 }
        );
    }

    return NextResponse.json({ ok: true });
}

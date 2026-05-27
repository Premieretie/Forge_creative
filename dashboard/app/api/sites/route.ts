import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const rootDir = process.cwd();
    const generatedSitesDir = path.join(rootDir, "..", "generated-sites");

    // Check if directory exists
    if (!fs.existsSync(generatedSitesDir)) {
      return NextResponse.json({ sites: [] });
    }

    // Get list of folders
    const entries = fs.readdirSync(generatedSitesDir, { withFileTypes: true });
    const sites = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    return NextResponse.json({ sites });
  } catch (error) {
    console.error("Error fetching sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

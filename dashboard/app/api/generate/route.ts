import { NextRequest, NextResponse } from "next/server";
import path from "path";
import {
  slugify,
  parseServices,
  copyTemplate,
  writeConfigFile,
  generateSiteConfig,
  directoryExists,
} from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const requiredFields = [
      "businessName",
      "phone",
      "suburb",
      "services",
      "primaryColor",
      "heroTitle",
      "heroSubtitle",
    ];

    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === "string" && !body[field].trim())) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate slug
    const slug = slugify(body.businessName);

    // Define paths
    const rootDir = process.cwd();
    const generatedSitesDir = path.join(rootDir, "..", "generated-sites");
    const projectDir = path.join(generatedSitesDir, slug);
    const templateDir = path.join(rootDir, "..", "trades-templates", "builders-temp");
    const configPath = path.join(projectDir, "site-config.json");

    // Check if project already exists
    if (directoryExists(projectDir)) {
      return NextResponse.json(
        {
          error: "Project already exists",
          message: `A site for "${body.businessName}" already exists at ${projectDir}`,
          suggestion: "Choose a different business name or delete the existing site.",
        },
        { status: 409 }
      );
    }

    // Check if template exists
    if (!directoryExists(templateDir)) {
      return NextResponse.json(
        {
          error: "Template not found",
          message: `Template directory not found at ${templateDir}`,
        },
        { status: 500 }
      );
    }

    // Parse services
    const services = parseServices(body.services);
    if (services.length === 0) {
      return NextResponse.json(
        { error: "At least one service is required" },
        { status: 400 }
      );
    }

    // Step 1: Copy template
    await copyTemplate(templateDir, projectDir);

    // Step 2: Generate and write config
    const siteConfig = generateSiteConfig({
      businessName: body.businessName,
      phone: body.phone,
      suburb: body.suburb,
      services,
      primaryColor: body.primaryColor,
      heroTitle: body.heroTitle,
      heroSubtitle: body.heroSubtitle,
      email: body.email,
      state: body.state || "QLD",
    });

    await writeConfigFile(configPath, siteConfig);

    // Success response
    return NextResponse.json({
      success: true,
      message: "Website generated successfully",
      project: {
        name: body.businessName,
        slug,
        path: projectDir,
        configPath,
      },
      nextSteps: [
        `cd generated-sites/${slug}`,
        "npm install",
        "npm run build",
        "Deploy the 'dist' folder to your hosting provider",
      ],
    });

  } catch (error) {
    console.error("Site generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate site",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

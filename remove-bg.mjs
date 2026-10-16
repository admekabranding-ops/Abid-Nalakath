import { removeBackground } from "@imgly/background-removal-node";
import fs from "fs";
import path from "path";

async function processImage() {
  console.log("Starting background removal on abid-raw.jpg...");
  const inputPath = path.resolve("public/assets/abid-raw.jpg");
  const outputPath = path.resolve("public/assets/abid-portrait.png");
  
  try {
    const blob = await removeBackground(inputPath);
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log("Successfully created transparent portrait at:", outputPath);
  } catch (err) {
    console.error("Error removing background with imgly:", err);
  }
}

processImage();

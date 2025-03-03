const fs = require("fs").promises;
const path = require("path");
const { createWorker } = require("tesseract.js");

async function processDirectory(directoryPath) {
  try {
    // Create an OCR worker
    const worker = await createWorker("eng");

    // Read all files in the directory
    const files = await fs.readdir(directoryPath);
    const pngFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".png"
    );

    if (pngFiles.length === 0) {
      console.log("No PNG files found in the directory.");
      await worker.terminate();
      return;
    }

    console.log(`Found ${pngFiles.length} PNG files to process.`);

    // Create results directory if it doesn't exist
    const resultsDir = path.join(directoryPath, "ocr_results");
    try {
      await fs.mkdir(resultsDir);
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }

    let totalWordCount = 0;
    const fileSummaries = [];

    // Process each PNG file
    for (const file of pngFiles) {
      const filePath = path.join(directoryPath, file);
      console.log(`Processing ${file}...`);

      // Perform OCR on the image
      const { data } = await worker.recognize(filePath);
      const text = data.text.trim();

      // Count words
      const words = text.split(/\s+/).filter((word) => word.length > 0);
      const wordCount = words.length;
      totalWordCount += wordCount;

      // Generate report for this file
      const wordFrequency = {};
      for (const word of words) {
        const cleanWord = word
          .toLowerCase()
          .replace(/[^\w\s']|_/g, "")
          .trim();
        if (cleanWord) {
          wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
        }
      }

      // Sort words by frequency
      const sortedWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .map(([word, count]) => `${word}: ${count}`);

      // Create output content
      const outputContent = [
        `File: ${file}`,
        `Total Words: ${wordCount}`,
        `Unique Words: ${Object.keys(wordFrequency).length}`,
        `\nWord Frequency:`,
        ...sortedWords,
      ].join("\n");

      // Write to individual file
      const outputFileName = path.join(
        resultsDir,
        `${path.basename(file, ".png")}_ocr.txt`
      );
      await fs.writeFile(outputFileName, outputContent);

      fileSummaries.push({
        fileName: file,
        wordCount,
        uniqueWords: Object.keys(wordFrequency).length,
      });

      console.log(`Processed ${file}: ${wordCount} words found`);
    }

    // Generate summary file
    const summaryContent = [
      "OCR Processing Summary",
      `Total Files Processed: ${pngFiles.length}`,
      `Total Words Across All Files: ${totalWordCount}`,
      "\nIndividual File Summary:",
      ...fileSummaries.map(
        (summary) =>
          `${summary.fileName}: ${summary.wordCount} words (${summary.uniqueWords} unique)`
      ),
    ].join("\n");

    await fs.writeFile(
      path.join(resultsDir, "ocr_summary.txt"),
      summaryContent
    );
    console.log(
      `\nProcessing complete! Summary written to ${path.join(
        resultsDir,
        "ocr_summary.txt"
      )}`
    );

    // Terminate worker
    await worker.terminate();
  } catch (error) {
    console.error("Error:", error);
  }
}

const directoryPath = path.join(__dirname, "imgs");

console.log(`Using image directory: ${directoryPath}`);

processDirectory(directoryPath);

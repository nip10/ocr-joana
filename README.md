# PNG OCR Processor

A Node.js utility that extracts text from PNG images using Optical Character Recognition (OCR) and generates detailed reports of the words found.

## Overview

This script processes all PNG files in a directory, extracts text using Tesseract OCR, counts the words, and generates comprehensive reports including:
- Individual text files for each image with word frequency analysis
- A summary file with aggregated statistics

## Features

- Processes multiple PNG files in batch
- Performs OCR text extraction
- Counts total words per image
- Identifies unique words and their frequencies
- Generates detailed reports in text format
- Creates a summary with statistics across all processed images

## Requirements

- Node.js v20.0.0 or higher
- npm (Node Package Manager)

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Project Setup

The project already includes an `imgs` folder (maintained with a `.gitkeep` file) where you should place your PNG files:

1. Place your PNG files in the existing `imgs` folder

## Usage

Run the script with:

```bash
npm start
```

The script will:
1. Process all PNG files in the `imgs` directory
2. Create an `ocr_results` directory inside the `imgs` folder
3. Generate individual OCR report files for each image
4. Create a summary file with aggregate statistics

## Output Format

### Individual File Reports (example_ocr.txt)

```
File: example.png
Total Words: 42
Unique Words: 28

Word Frequency:
the: 5
and: 3
to: 2
...
```

### Summary File (ocr_summary.txt)

```
OCR Processing Summary
Total Files Processed: 5
Total Words Across All Files: 287

Individual File Summary:
image1.png: 42 words (28 unique)
image2.png: 56 words (34 unique)
...
```

## Customization

You can modify the script to change:
- The input directory path
- Output formatting
- Word cleaning and filtering
- Language settings for OCR

## Dependencies

- [tesseract.js](https://github.com/naptha/tesseract.js) - OCR engine for JavaScript
- Node.js built-in modules (fs, path)

## License

MIT

## Author

Diogo Cardoso

## Acknowledgments

- Tesseract.js team for providing OCR capabilities
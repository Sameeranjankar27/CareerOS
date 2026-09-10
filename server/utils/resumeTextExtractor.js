const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const extractResumeText = async (filePath, fileType) => {
  try {
    const absolutePath = path.resolve(filePath);

    const fileBuffer = fs.readFileSync(absolutePath);

    // PDF
    if (fileType === "application/pdf") {
      const parser = new PDFParse({
        data: fileBuffer,
      });

      try {
        const result = await parser.getText();

        return result.text;
      } finally {
        await parser.destroy();
      }
    }

    // DOCX
    if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: fileBuffer,
      });

      return result.value;
    }

    // DOC
    if (fileType === "application/msword") {
      throw new Error(
        "Legacy .doc files are not supported for text extraction yet."
      );
    }

    throw new Error("Unsupported resume file type");
  } catch (error) {
    console.error(
      "Resume Text Extraction Error:",
      error
    );

    throw error;
  }
};

module.exports = extractResumeText;
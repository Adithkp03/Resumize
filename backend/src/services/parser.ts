import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseResume(filePath: string, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      throw new Error('Unsupported file format. Please upload PDF or DOCX.');
    }
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse the resume file.');
  }
}

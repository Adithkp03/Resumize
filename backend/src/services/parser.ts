import fs from 'fs';
import mammoth from 'mammoth';

export async function parseResume(filePath: string, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    let extractText: any, getDocumentProxy: any;
    try {
      const unpdf = await import('unpdf');
      extractText = unpdf.extractText;
      getDocumentProxy = unpdf.getDocumentProxy;
    } catch (importError: any) {
      console.error('Failed to import unpdf:', importError);
      throw new Error(`PDF parser module failed to load: ${importError.message}`);
    }
    try {
      const pdf = await getDocumentProxy(new Uint8Array(dataBuffer));
      const result = await extractText(pdf, { mergePages: true });
      return result.text;
    } catch (parseError: any) {
      console.error('Failed to parse PDF:', parseError);
      throw new Error(`PDF parsing failed: ${parseError.message}`);
    }
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    throw new Error('Unsupported file format. Please upload PDF or DOCX.');
  }
}

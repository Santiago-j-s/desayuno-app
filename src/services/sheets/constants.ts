export const SHEETS_API_URL = "https://sheets.googleapis.com";

if (!process.env.TEXTS_TSV) {
  throw new Error("TEXTS_TSV is not set");
}

if (!process.env.IMAGES_TSV) {
  throw new Error("IMAGES_TSV is not set");
}

if (!process.env.DESAYUNO_TSV) {
  throw new Error("DESAYUNO_TSV is not set");
}

const TEXTS_TSV = process.env.TEXTS_TSV;
const IMAGES_TSV = process.env.IMAGES_TSV;
const DESAYUNO_TSV = process.env.DESAYUNO_TSV;

function extractSheetId(url: string) {
  // Extract the sheet ID from the URL
  const match = url.match(/\/d\/([^/]+)/);
  return match ? match[1] : "";
}

export const TEXTS = {
  ID: extractSheetId(TEXTS_TSV),
  RANGE: "Texts!A1:B100" as const,
};

export const IMAGES = {
  ID: extractSheetId(IMAGES_TSV),
  RANGE: "Images!A1:B100" as const,
};

export const DESAYUNO = {
  ID: extractSheetId(DESAYUNO_TSV),
  READ_RANGE: "Desayuno!A1:C100" as const,
  WRITE_RANGE: "Desayuno!B1:C100" as const,
};

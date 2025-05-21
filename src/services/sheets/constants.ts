export const SHEETS_API_URL = "https://sheets.googleapis.com";

if (!process.env.TEXTS_TSV) {
  throw new Error("TEXTS_TSV is not set");
}

if (!process.env.IMAGES_TSV) {
  throw new Error("IMAGES_TSV is not set");
}

if (!process.env.DESAYUNOS_TSV) {
  throw new Error("DESAYUNOS_TSV is not set");
}

const DESAYUNOS_TSV = process.env.DESAYUNOS_TSV;

function extractSheetId(url: string) {
  // Extract the sheet ID from the URL
  const match = url.match(/\/d\/([^/]+)/);
  return match ? match[1] : "";
}

export const DESAYUNO = {
  ID: extractSheetId(DESAYUNOS_TSV),
  READ_RANGE: "Desayuno!A1:C100" as const,
  WRITE_RANGE: "Desayuno!B1:C100" as const,
};

const SHEETS_API_URL = "https://sheets.googleapis.com";
// TEXTS_TSV=https://docs.google.com/spreadsheets/d/1mqyPXplKSNSfLOgQoQdHsRc4YUt0BC3ViCWx4Ixxrgs/export?gid=0&format=tsv
const spreadsheetId = process.env.TEXTS_TSV?.replaceAll(
  "https://docs.google.com/spreadsheets/d/",
  ""
).replaceAll("/export?gid=0&format=tsv", "");

export async function getSheetData(accessToken: string) {
  const response = await fetch(
    `${SHEETS_API_URL}/v4/spreadsheets/${spreadsheetId}/values/A1:A100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  return data;
}

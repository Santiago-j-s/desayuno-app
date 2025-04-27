import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { IMAGES, SHEETS_API_URL, TEXTS } from "./constants";

// SheetName!InitialCell:FinalCell -> Texts!A1:A100
type SheetRange = `${string}!${string}:${string}`;

interface SheetData {
  range: SheetRange;
  majorDimension: "ROWS" | "COLUMNS";
  // [row][column]
  values: string[][];
}

async function getSheetData(
  accessToken: string,
  sheetId: string,
  range: SheetRange,
): Promise<SheetData> {
  "use cache";

  cacheTag(`sheets-${sheetId}`);

  const response = await fetch(
    `${SHEETS_API_URL}/v4/spreadsheets/${sheetId}/values/${range}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  return data;
}

async function updateSheetData(
  accessToken: string,
  sheetId: string,
  range: SheetRange,
  values: string[],
) {
  const params = new URLSearchParams();

  params.set("valueInputOption", "RAW");

  const response = await fetch(
    `${SHEETS_API_URL}/v4/spreadsheets/${sheetId}/values/${range}?${params}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        range,
        majorDimension: "COLUMNS",
        values: [values],
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error.message);
  }

  revalidateTag(`sheets-${sheetId}`);

  return response.json();
}

export async function getTextsFromSheet(
  accessToken: string,
): Promise<{ key: string; text: string }[]> {
  const data = await getSheetData(accessToken, TEXTS.ID, TEXTS.RANGE);

  return data.values.map((row, index) => ({
    key: `${index}-${row[0]}`,
    text: row[0],
  }));
}

export async function getImagesFromSheet(
  accessToken: string,
): Promise<string[]> {
  const data = await getSheetData(accessToken, IMAGES.ID, IMAGES.RANGE);

  return data.values.map((row) => row[0]);
}

export async function updateImagesInSheet(
  accessToken: string,
  values: string[],
) {
  return updateSheetData(accessToken, IMAGES.ID, IMAGES.RANGE, values);
}

export async function updateTextsInSheet(
  accessToken: string,
  values: { key: string; text: string }[],
) {
  return updateSheetData(
    accessToken,
    TEXTS.ID,
    TEXTS.RANGE,
    values.map(({ text }) => text),
  );
}

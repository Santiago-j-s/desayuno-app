import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { DESAYUNO, SHEETS_API_URL } from "./constants";

const DEBUG_REQUESTS = process.env.DEBUG_REQUESTS === "true";

// SheetName!InitialCell:FinalCell -> Texts!A1:A100
type SheetRange = `${string}!${string}:${string}`;

interface SuccessSheetData {
  range: SheetRange;
  majorDimension: "ROWS" | "COLUMNS";
  // [row][column]
  values: string[][];
}

interface ErrorSheetData {
  error: {
    message: string;
    code: string;
    status: string;
  };
}

type SheetData = SuccessSheetData | ErrorSheetData;

async function getSheetData(
  accessToken: string,
  sheetId: string,
  range: SheetRange,
): Promise<SheetData> {
  "use cache";

  cacheTag(`sheets-${sheetId}`);

  const url = `${SHEETS_API_URL}/v4/spreadsheets/${sheetId}/values/${range}`;

  if (DEBUG_REQUESTS) {
    console.log(`\x1b[32m[SHEETS] ${url}\x1b[0m`);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    try {
      const error = (await response.json()) as ErrorSheetData;

      console.error(
        `\x1b[31m[SHEETS] error ${error.error.message} ${error.error.code}\x1b[0m`,
      );

      return error;
    } catch {
      throw new Error(response.statusText);
    }
  }

  const data = await response.json();

  return data;
}

async function updateSheetData(
  accessToken: string,
  sheetId: string,
  range: SheetRange,
  values: string[] | string[][],
) {
  const params = new URLSearchParams();

  params.set("valueInputOption", "RAW");

  const url = `${SHEETS_API_URL}/v4/spreadsheets/${sheetId}/values/${range}?${params}`;

  const isTwoDimensional = Array.isArray(values[0]);

  const body = {
    range,
    majorDimension: isTwoDimensional ? "ROWS" : "COLUMNS",
    values: isTwoDimensional ? values : [values],
  };

  if (DEBUG_REQUESTS) {
    console.log(
      `\x1b[32m[SHEETS] \x1b[33m[PUT]\x1b[0m ${url}\n\x1b[33m${JSON.stringify(
        body,
        null,
        2,
      )}\x1b[0m`,
    );
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();

    console.error(
      `\x1b[31m[SHEETS] error ${error.error.message} ${error.error.code}\x1b[0m`,
    );

    throw new Error(error.error.message);
  }

  revalidateTag(`sheets-${sheetId}`);

  return response.json();
}

export async function getDesayunosFromSheet(
  accessToken: string,
): Promise<{ id: string; text: string; image: string }[]> {
  const data = await getSheetData(
    accessToken,
    DESAYUNO.ID,
    DESAYUNO.READ_RANGE,
  );

  if ("error" in data) {
    throw new Error(data.error.message);
  }

  return data.values
    .filter(
      (row) =>
        (typeof row[1] === "string" && row[1] !== "") ||
        (typeof row[2] === "string" && row[2] !== ""),
    )
    .map((row) => ({
      id: row[0],
      text: row[1],
      image: row[2],
    }));
}

export async function updateDesayunosInSheet(
  accessToken: string,
  values: [string, string, string][],
) {
  return updateSheetData(accessToken, DESAYUNO.ID, DESAYUNO.READ_RANGE, values);
}

export async function deleteDesayunoFromSheet(accessToken: string, id: string) {
  const data = await getSheetData(
    accessToken,
    DESAYUNO.ID,
    DESAYUNO.READ_RANGE,
  );

  if ("error" in data) {
    throw new Error(data.error.message);
  }

  const index = data.values.findIndex((row) => row[0] === id);

  if (index === -1) {
    throw new Error("Desayuno no encontrado");
  }

  const newValues = data.values.map((row, i) =>
    i === index ? ["", ""] : [row[1], row[2]],
  );

  return updateSheetData(
    accessToken,
    DESAYUNO.ID,
    DESAYUNO.WRITE_RANGE,
    newValues,
  );
}

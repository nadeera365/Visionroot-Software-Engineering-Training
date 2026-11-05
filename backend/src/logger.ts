type Level = "info" | "error";

export function log(
  level: Level,
  message: string,
  fields: Record<string, unknown> = {},
) {
  const line = JSON.stringify({
    time: new Date().toISOString(),
    level,
    message,
    ...fields,
  });
  if (level === "error") {
    console.error(line);
  } else {
    console.log(line);
  }
}

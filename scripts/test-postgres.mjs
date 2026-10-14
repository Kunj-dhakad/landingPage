import EmbeddedPostgres from "embedded-postgres";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";
import { mkdir } from "node:fs/promises";
const root = path.resolve(".runtime");
const dir = path.resolve(root, `test-postgres-${Date.now()}`);
if (!dir.startsWith(root + path.sep))
  throw Error("Invalid test database path.");
await mkdir(root, { recursive: true });
const password = randomBytes(24).toString("hex");
const dbPort = 55439,
  webPort = 3100;
const pg = new EmbeddedPostgres({
  databaseDir: dir,
  user: "postgres",
  password,
  port: dbPort,
  persistent: true,
  authMethod: "scram-sha-256",
  initdbFlags: ["--encoding=UTF8"],
  postgresFlags: ["-h", "127.0.0.1"],
  onLog: () => {},
  onError: () => {},
});
let server;
const env = {
  ...process.env,
  DATABASE_URL: `postgresql://postgres:${password}@127.0.0.1:${dbPort}/navonixx_test`,
  DIRECT_URL: `postgresql://postgres:${password}@127.0.0.1:${dbPort}/navonixx_test`,
  AUTH_SECRET: randomBytes(32).toString("hex"),
  AUTH_TRUST_HOST: "true",
  NEXT_PUBLIC_SITE_URL: `http://localhost:${webPort}`,
  NEXTAUTH_URL: `http://localhost:${webPort}`,
  ADMIN_EMAIL: "admin@example.test",
  ADMIN_PASSWORD: randomBytes(20).toString("hex"),
  RESEND_API_KEY: "",
  EMAIL_FROM: "",
  TEST_BASE_URL: `http://localhost:${webPort}`,
};
function run(file, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [file, ...args], {
      env,
      stdio: "inherit",
      windowsHide: true,
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(Error(`Command failed (${code}): ${file}`)),
    );
  });
}
try {
  console.log("Starting isolated real PostgreSQL integration tests.");
  await pg.initialise();
  await pg.start();
  await pg.createDatabase("navonixx_test");
  await run("node_modules/prisma/build/index.js", ["migrate", "deploy"]);
  await run("node_modules/tsx/dist/cli.mjs", ["prisma/seed.ts"]);
  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(webPort)],
    { env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
  );
  server.stdout.on("data", (d) => process.stdout.write(d));
  server.stderr.on("data", (d) => process.stderr.write(d));
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(env.TEST_BASE_URL);
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Server may still be starting. */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!ready) throw Error("Integration server did not become ready.");
  await run("node_modules/tsx/dist/cli.mjs", [
    "--test",
    "tests/database.integration.ts",
  ]);
  await run("scripts/verify.mjs", []);
  console.log(
    "PASS: real PostgreSQL persistence, auth, CRUD, analytics, consent, downloads and browser flows.",
  );
} finally {
  server?.kill();
  if (process.platform === "win32" && pg.process) {
    const processId = pg.process.pid;
    await new Promise((resolve, reject) => {
      const child = spawn(
        "powershell.exe",
        [
          "-NoProfile",
          "-File",
          "scripts/stop-test-postgres.ps1",
          "-DatabaseDirectory",
          dir,
          "-SpawnedProcessId",
          String(processId),
        ],
        { stdio: "inherit", windowsHide: true },
      );
      child.on("error", reject);
      child.on("exit", (code) =>
        code === 0
          ? resolve()
          : reject(Error("Test database shutdown failed.")),
      );
    });
    pg.process = undefined;
  } else await pg.stop();
}

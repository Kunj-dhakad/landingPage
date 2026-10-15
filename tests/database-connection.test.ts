import test from "node:test";
import assert from "node:assert/strict";
import { databaseConnectionUrl, retryDatabaseRead } from "../src/lib/database-connection";

test("database connections allow cold starts and preserve explicit settings", () => {
  const url = new URL(databaseConnectionUrl("postgresql://user:password@localhost/db?sslmode=require")!);
  assert.equal(url.searchParams.get("connect_timeout"), "15");
  assert.equal(url.searchParams.get("pool_timeout"), "15");
  assert.equal(url.searchParams.get("sslmode"), "require");
  const custom = new URL(databaseConnectionUrl("postgresql://localhost/db?connect_timeout=4&pool_timeout=8")!);
  assert.equal(custom.searchParams.get("connect_timeout"), "4");
  assert.equal(custom.searchParams.get("pool_timeout"), "8");
  assert.equal(databaseConnectionUrl(undefined), undefined);
});

test("public reads recover from one connection failure", async () => {
  for (const code of ["P1001", "P1002", "P1017", "P2024"]) {
    let attempts = 0;
    const result = await retryDatabaseRead(async () => {
      if (++attempts === 1) throw Object.assign(new Error("Connection unavailable"), { errorCode: code });
      return ["stored record"];
    });
    assert.deepEqual(result, ["stored record"]);
    assert.equal(attempts, 2);
  }
});

test("persistent failures propagate and unrelated errors are never retried", async () => {
  for (const code of ["P1001", "P2002"]) {
    let attempts = 0;
    const error = Object.assign(new Error("Database error"), { code });
    await assert.rejects(retryDatabaseRead(async () => { attempts++; throw error; }), e => e === error);
    assert.equal(attempts, code === "P1001" ? 2 : 1);
  }
});

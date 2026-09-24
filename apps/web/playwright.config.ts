import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  timeout: 60_000,
  use: { baseURL: "http://localhost:3005", browserName: "chromium", channel: "msedge", headless: true, trace: "retain-on-failure" },
});

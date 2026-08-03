var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_fs = require("fs");
var import_crypto = require("crypto");
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = Number.parseInt(process.env.PORT || "3000", 10);
var SCORES_FILE = import_path.default.resolve(
  process.env.SCORES_FILE || import_path.default.join(process.cwd(), "data", "scores.json")
);
var MAX_RANKING_LIMIT = 100;
var MAX_SCORE = 1e4;
app.use(import_express.default.json({ limit: "32kb" }));
var dbScores = [];
var mutationQueue = Promise.resolve();
function calculateRanks(scoresList) {
  const sorted = [...scoresList].sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    if (a.finalError !== b.finalError) {
      return a.finalError - b.finalError;
    }
    return a.createdAt.localeCompare(b.createdAt);
  });
  let currentRank = 1;
  return sorted.map((item, index, array) => {
    if (index > 0) {
      const previous = array[index - 1];
      if (item.score !== previous.score || item.finalError !== previous.finalError) {
        currentRank = index + 1;
      }
    }
    return { ...item, rank: currentRank };
  });
}
function toPublicScore(item) {
  const {
    phone: _phone,
    phoneRegisteredAt: _phoneRegisteredAt,
    contactToken: _contactToken,
    ...publicItem
  } = item;
  return publicItem;
}
function toSubmittedScore(item) {
  return {
    ...toPublicScore(item),
    contactToken: item.contactToken
  };
}
function normalizePhone(value) {
  if (typeof value !== "string") return null;
  const digits = value.replace(/\D/g, "");
  return /^01[016789]\d{7,8}$/.test(digits) ? digits : null;
}
function validateScoreInput(input) {
  const nickname = typeof input.nickname === "string" ? input.nickname.trim() : "";
  const score = Number(input.score);
  const stage = Number(input.stage);
  const finalError = Number(input.finalError);
  if (!nickname || nickname.length > 12) {
    return "\uB2C9\uB124\uC784\uC740 1\uC790 \uC774\uC0C1 12\uC790 \uC774\uD558\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.";
  }
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE || !Number.isInteger(score)) {
    return "\uC810\uC218\uB294 0\uC5D0\uC11C 10000 \uC0AC\uC774\uC758 \uC815\uC218\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.";
  }
  if (stage !== 4) {
    return "4\uB77C\uC6B4\uB4DC\uB97C \uC644\uB8CC\uD55C \uC810\uC218\uB9CC \uB4F1\uB85D\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.";
  }
  if (!Number.isFinite(finalError) || finalError < 0) {
    return "4\uB77C\uC6B4\uB4DC \uC624\uCC28 \uAC12\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
  }
  const expectedScore = Math.max(0, MAX_SCORE - Math.round(finalError * 1e3));
  if (score !== expectedScore) {
    return "\uC810\uC218\uC640 4\uB77C\uC6B4\uB4DC \uC624\uCC28\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
  }
  if (input.selectedDemerits !== void 0 && (!Array.isArray(input.selectedDemerits) || input.selectedDemerits.some((id) => typeof id !== "string"))) {
    return "\uB514\uBA54\uB9AC\uD2B8 \uBAA9\uB85D\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.";
  }
  return null;
}
function isScoreItem(value) {
  if (!value || typeof value !== "object") return false;
  const item = value;
  return typeof item.id === "string" && typeof item.nickname === "string" && Number.isFinite(item.score) && Number.isFinite(item.stage) && Number.isFinite(item.finalError) && Array.isArray(item.selectedDemerits) && typeof item.createdAt === "string" && (item.contactToken === void 0 || typeof item.contactToken === "string") && (item.phone === void 0 || typeof item.phone === "string") && (item.phoneRegisteredAt === void 0 || typeof item.phoneRegisteredAt === "string");
}
async function loadScores() {
  try {
    const raw = await import_fs.promises.readFile(SCORES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isScoreItem)) {
      throw new Error("\uC810\uC218 \uD30C\uC77C \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
    }
    return calculateRanks(parsed);
  } catch (error) {
    const nodeError = error;
    if (nodeError.code !== "ENOENT") throw error;
    await persistScores([]);
    return [];
  }
}
async function persistScores(scores) {
  const directory = import_path.default.dirname(SCORES_FILE);
  const temporaryFile = `${SCORES_FILE}.${process.pid}.${Date.now()}.tmp`;
  await import_fs.promises.mkdir(directory, { recursive: true });
  await import_fs.promises.writeFile(temporaryFile, `${JSON.stringify(scores, null, 2)}
`, "utf8");
  await import_fs.promises.rename(temporaryFile, SCORES_FILE);
}
function addScore(record) {
  let savedRecord = record;
  const operation = mutationQueue.then(async () => {
    const nextScores = calculateRanks([...dbScores, record]);
    await persistScores(nextScores);
    dbScores = nextScores;
    savedRecord = dbScores.find((item) => item.id === record.id) || record;
  });
  mutationQueue = operation.catch(() => void 0);
  return operation.then(() => savedRecord);
}
app.get("/api/health", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ success: true, scoreCount: dbScores.length });
});
app.post("/api/scores", async (req, res) => {
  const input = req.body;
  const validationError = validateScoreInput(input);
  if (validationError) {
    res.status(400).json({ success: false, error: validationError });
    return;
  }
  const newRecord = {
    id: (0, import_crypto.randomUUID)(),
    nickname: input.nickname.trim(),
    score: Number(input.score),
    stage: Number(input.stage),
    finalError: Number(input.finalError),
    selectedDemerits: Array.isArray(input.selectedDemerits) ? [...new Set(input.selectedDemerits)] : [],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    contactToken: (0, import_crypto.randomUUID)()
  };
  try {
    const saved = await addScore(newRecord);
    res.set("Cache-Control", "no-store");
    res.status(201).json({ success: true, data: toSubmittedScore(saved) });
  } catch (error) {
    console.error("[SetStop Server] Failed to save score:", error);
    res.status(500).json({ success: false, error: "\uC810\uC218\uB97C \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4." });
  }
});
app.post("/api/scores/:id/contact", async (req, res) => {
  const scoreId = String(req.params.id || "").trim();
  const input = req.body;
  const normalizedPhone = normalizePhone(input.phone);
  const contactToken = typeof input.contactToken === "string" ? input.contactToken : "";
  if (!scoreId) {
    res.status(400).json({ success: false, error: "\uC810\uC218 \uAE30\uB85D\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." });
    return;
  }
  if (!normalizedPhone) {
    res.status(400).json({ success: false, error: "\uC62C\uBC14\uB978 \uD734\uB300\uC804\uD654 \uBC88\uD638\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694." });
    return;
  }
  let outcome = null;
  const operation = mutationQueue.then(async () => {
    const rankedScores = calculateRanks(dbScores);
    const current = rankedScores.find((item) => item.id === scoreId);
    if (!current) {
      outcome = { status: 404, error: "\uC810\uC218 \uAE30\uB85D\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." };
      return;
    }
    if (!current.contactToken || current.contactToken !== contactToken) {
      outcome = { status: 404, error: "\uC5F0\uB77D\uCC98 \uB4F1\uB85D \uAD8C\uD55C\uC744 \uD655\uC778\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." };
      return;
    }
    const currentRank = current.rank || rankedScores.indexOf(current) + 1;
    if (currentRank > 5) {
      outcome = {
        status: 409,
        rank: currentRank,
        error: `\uD604\uC7AC ${currentRank}\uC704\uB85C 5\uC704 \uBC16\uC774\uC5B4\uC11C \uC0C1\uD488 \uC5F0\uB77D\uCC98\uB97C \uB4F1\uB85D\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.`
      };
      return;
    }
    const registeredAt = (/* @__PURE__ */ new Date()).toISOString();
    const nextScores = rankedScores.map((item) => item.id === scoreId ? { ...item, phone: normalizedPhone, phoneRegisteredAt: registeredAt } : item);
    await persistScores(nextScores);
    dbScores = nextScores;
    outcome = {
      status: 200,
      data: { id: scoreId, rank: currentRank, phoneRegistered: true }
    };
  });
  mutationQueue = operation.catch(() => void 0);
  try {
    await operation;
    if (!outcome) {
      throw new Error("\uC5F0\uB77D\uCC98 \uB4F1\uB85D \uACB0\uACFC\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    }
    if (outcome.status !== 200) {
      res.status(outcome.status).json({
        success: false,
        error: outcome.error,
        rank: outcome.rank,
        eligible: false
      });
      return;
    }
    res.set("Cache-Control", "no-store");
    res.json({ success: true, data: outcome.data });
  } catch (error) {
    console.error("[SetStop Server] Failed to save prize contact:", error);
    res.status(500).json({ success: false, error: "\uC5F0\uB77D\uCC98\uB97C \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4." });
  }
});
app.get("/api/scores/rankings", (req, res) => {
  const requestedLimit = Number.parseInt(String(req.query.limit || "10"), 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), MAX_RANKING_LIMIT) : 10;
  res.set("Cache-Control", "no-store");
  res.json(calculateRanks(dbScores).slice(0, limit).map(toPublicScore));
});
async function start() {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error(`PORT \uAC12\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4: ${process.env.PORT}`);
  }
  dbScores = await loadScores();
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SetStop Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[SetStop Server] Scores file: ${SCORES_FILE}`);
  });
}
start().catch((error) => {
  console.error("[SetStop Server] Failed to start:", error);
  process.exitCode = 1;
});
//# sourceMappingURL=server.cjs.map

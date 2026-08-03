import "dotenv/config";
import express from "express";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const SCORES_FILE = path.resolve(
  process.env.SCORES_FILE || path.join(process.cwd(), "data", "scores.json")
);
const MAX_RANKING_LIMIT = 100;
const MAX_SCORE = 10000;

app.use(express.json({ limit: "32kb" }));

interface ScoreItem {
  id: string;
  rank?: number;
  nickname: string;
  score: number;
  stage: number;
  finalError: number;
  selectedDemerits: string[];
  createdAt: string;
  contactToken?: string;
  phone?: string;
  phoneRegisteredAt?: string;
}

interface ScoreInput {
  nickname?: unknown;
  score?: unknown;
  stage?: unknown;
  finalError?: unknown;
  selectedDemerits?: unknown;
}

interface PrizeContactInput {
  phone?: unknown;
  contactToken?: unknown;
}

let dbScores: ScoreItem[] = [];
let mutationQueue: Promise<void> = Promise.resolve();

function calculateRanks(scoresList: ScoreItem[]): ScoreItem[] {
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
      if (
        item.score !== previous.score ||
        item.finalError !== previous.finalError
      ) {
        currentRank = index + 1;
      }
    }

    return { ...item, rank: currentRank };
  });
}

function toPublicScore(item: ScoreItem) {
  const {
    phone: _phone,
    phoneRegisteredAt: _phoneRegisteredAt,
    contactToken: _contactToken,
    ...publicItem
  } = item;
  return publicItem;
}

function toSubmittedScore(item: ScoreItem) {
  return {
    ...toPublicScore(item),
    contactToken: item.contactToken
  };
}

function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const digits = value.replace(/\D/g, "");
  return /^01[016789]\d{7,8}$/.test(digits) ? digits : null;
}

function validateScoreInput(input: ScoreInput): string | null {
  const nickname = typeof input.nickname === "string" ? input.nickname.trim() : "";
  const score = Number(input.score);
  const stage = Number(input.stage);
  const finalError = Number(input.finalError);

  if (!nickname || nickname.length > 12) {
    return "닉네임은 1자 이상 12자 이하이어야 합니다.";
  }
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE || !Number.isInteger(score)) {
    return "점수는 0에서 10000 사이의 정수이어야 합니다.";
  }
  if (stage !== 4) {
    return "4라운드를 완료한 점수만 등록할 수 있습니다.";
  }
  if (!Number.isFinite(finalError) || finalError < 0) {
    return "4라운드 오차 값이 올바르지 않습니다.";
  }
  const expectedScore = Math.max(0, MAX_SCORE - Math.round(finalError * 1000));
  if (score !== expectedScore) {
    return "점수와 4라운드 오차가 일치하지 않습니다.";
  }
  if (
    input.selectedDemerits !== undefined &&
    (!Array.isArray(input.selectedDemerits) ||
      input.selectedDemerits.some((id) => typeof id !== "string"))
  ) {
    return "디메리트 목록이 올바르지 않습니다.";
  }

  return null;
}

function isScoreItem(value: unknown): value is ScoreItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ScoreItem>;
  return (
    typeof item.id === "string" &&
    typeof item.nickname === "string" &&
    Number.isFinite(item.score) &&
    Number.isFinite(item.stage) &&
    Number.isFinite(item.finalError) &&
    Array.isArray(item.selectedDemerits) &&
    typeof item.createdAt === "string" &&
    (item.contactToken === undefined || typeof item.contactToken === "string") &&
    (item.phone === undefined || typeof item.phone === "string") &&
    (item.phoneRegisteredAt === undefined || typeof item.phoneRegisteredAt === "string")
  );
}

async function loadScores(): Promise<ScoreItem[]> {
  try {
    const raw = await fs.readFile(SCORES_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isScoreItem)) {
      throw new Error("점수 파일 형식이 올바르지 않습니다.");
    }
    return calculateRanks(parsed);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") throw error;

    await persistScores([]);
    return [];
  }
}

async function persistScores(scores: ScoreItem[]): Promise<void> {
  const directory = path.dirname(SCORES_FILE);
  const temporaryFile = `${SCORES_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(temporaryFile, `${JSON.stringify(scores, null, 2)}\n`, "utf8");
  await fs.rename(temporaryFile, SCORES_FILE);
}

function addScore(record: ScoreItem): Promise<ScoreItem> {
  let savedRecord: ScoreItem = record;

  const operation = mutationQueue.then(async () => {
    const nextScores = calculateRanks([...dbScores, record]);
    await persistScores(nextScores);
    dbScores = nextScores;
    savedRecord = dbScores.find((item) => item.id === record.id) || record;
  });

  mutationQueue = operation.catch(() => undefined);
  return operation.then(() => savedRecord);
}

app.get("/api/health", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ success: true, scoreCount: dbScores.length });
});

app.post("/api/scores", async (req, res) => {
  const input = req.body as ScoreInput;
  const validationError = validateScoreInput(input);
  if (validationError) {
    res.status(400).json({ success: false, error: validationError });
    return;
  }

  const newRecord: ScoreItem = {
    id: randomUUID(),
    nickname: (input.nickname as string).trim(),
    score: Number(input.score),
    stage: Number(input.stage),
    finalError: Number(input.finalError),
    selectedDemerits: Array.isArray(input.selectedDemerits)
      ? [...new Set(input.selectedDemerits as string[])]
      : [],
    createdAt: new Date().toISOString(),
    contactToken: randomUUID()
  };

  try {
    const saved = await addScore(newRecord);
    res.set("Cache-Control", "no-store");
    res.status(201).json({ success: true, data: toSubmittedScore(saved) });
  } catch (error) {
    console.error("[SetStop Server] Failed to save score:", error);
    res.status(500).json({ success: false, error: "점수를 저장하지 못했습니다." });
  }
});

app.post("/api/scores/:id/contact", async (req, res) => {
  const scoreId = String(req.params.id || "").trim();
  const input = req.body as PrizeContactInput;
  const normalizedPhone = normalizePhone(input.phone);
  const contactToken = typeof input.contactToken === "string" ? input.contactToken : "";

  if (!scoreId) {
    res.status(400).json({ success: false, error: "점수 기록을 찾을 수 없습니다." });
    return;
  }
  if (!normalizedPhone) {
    res.status(400).json({ success: false, error: "올바른 휴대전화 번호를 입력해 주세요." });
    return;
  }

  let outcome:
    | { status: 200; data: { id: string; rank: number; phoneRegistered: true } }
    | { status: 404 | 409; error: string; rank?: number }
    | null = null;

  const operation = mutationQueue.then(async () => {
    const rankedScores = calculateRanks(dbScores);
    const current = rankedScores.find((item) => item.id === scoreId);

    if (!current) {
      outcome = { status: 404, error: "점수 기록을 찾을 수 없습니다." };
      return;
    }

    if (!current.contactToken || current.contactToken !== contactToken) {
      outcome = { status: 404, error: "연락처 등록 권한을 확인할 수 없습니다." };
      return;
    }

    const currentRank = current.rank || rankedScores.indexOf(current) + 1;
    if (currentRank > 5) {
      outcome = {
        status: 409,
        rank: currentRank,
        error: `현재 ${currentRank}위로 5위 밖이어서 상품 연락처를 등록할 수 없습니다.`
      };
      return;
    }

    const registeredAt = new Date().toISOString();
    const nextScores = rankedScores.map((item) => (
      item.id === scoreId
        ? { ...item, phone: normalizedPhone, phoneRegisteredAt: registeredAt }
        : item
    ));

    await persistScores(nextScores);
    dbScores = nextScores;
    outcome = {
      status: 200,
      data: { id: scoreId, rank: currentRank, phoneRegistered: true }
    };
  });

  mutationQueue = operation.catch(() => undefined);

  try {
    await operation;
    if (!outcome) {
      throw new Error("연락처 등록 결과를 확인하지 못했습니다.");
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
    res.status(500).json({ success: false, error: "연락처를 저장하지 못했습니다." });
  }
});

app.get("/api/scores/rankings", (req, res) => {
  const requestedLimit = Number.parseInt(String(req.query.limit || "10"), 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), MAX_RANKING_LIMIT)
    : 10;

  res.set("Cache-Control", "no-store");
  res.json(calculateRanks(dbScores).slice(0, limit).map(toPublicScore));
});

async function start() {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error(`PORT 값이 올바르지 않습니다: ${process.env.PORT}`);
  }

  dbScores = await loadScores();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
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

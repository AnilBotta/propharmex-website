/**
 * Unit tests for retrieve() — verifies the embed → RPC → row-mapping shape.
 *
 * Mocks the Supabase client + embedder so the test runs in CI without keys.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the embedder + supabase modules BEFORE importing retrieve().
vi.mock("../embedder", () => ({
  embedQuery: vi.fn(),
}));
vi.mock("../../supabase/server", () => ({
  getServerSupabase: vi.fn(),
}));

import { embedQuery } from "../embedder";
import { retrieve } from "../retrieve";
import { getServerSupabase } from "../../supabase/server";

interface RpcResponse {
  data: unknown;
  error: unknown;
}

function makeSupabaseStub(rpcResponse: RpcResponse) {
  return {
    rpc: vi.fn(async () => rpcResponse),
  };
}

describe("retrieve", () => {
  beforeEach(() => {
    vi.mocked(embedQuery).mockReset();
    vi.mocked(getServerSupabase).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns [] for empty queries without calling the embedder", async () => {
    const result = await retrieve("   ");
    expect(result).toEqual([]);
    expect(embedQuery).not.toHaveBeenCalled();
  });

  it("returns [] when the embedder cannot embed (no key)", async () => {
    vi.mocked(embedQuery).mockResolvedValue(null);
    const result = await retrieve("hello");
    expect(result).toEqual([]);
  });

  it("returns [] when Supabase is not configured", async () => {
    vi.mocked(embedQuery).mockResolvedValue([0.1, 0.2, 0.3]);
    vi.mocked(getServerSupabase).mockReturnValue(null);
    const result = await retrieve("hello");
    expect(result).toEqual([]);
  });

  it("maps row shape to the typed RetrievedChunk", async () => {
    vi.mocked(embedQuery).mockResolvedValue([0.1, 0.2, 0.3]);
    const stub = makeSupabaseStub({
      data: [
        {
          id: "page:/x:hero:0",
          content: "lede text",
          source_url: "/x",
          source_title: "X",
          section: "Hero",
          content_type: "page",
          score: 0.91,
        },
      ],
      error: null,
    });
    vi.mocked(getServerSupabase).mockReturnValue(stub as never);

    const result = await retrieve("does this thing work?", { topK: 4, minScore: 0.5 });

    expect(stub.rpc).toHaveBeenCalledWith("match_chunks", {
      query_embedding: [0.1, 0.2, 0.3],
      match_count: 4,
      min_score: 0.5,
    });
    expect(result).toEqual([
      {
        id: "page:/x:hero:0",
        content: "lede text",
        sourceUrl: "/x",
        sourceTitle: "X",
        section: "Hero",
        contentType: "page",
        score: 0.91,
      },
    ]);
  });

  it("returns [] (and does not throw) when the RPC errors", async () => {
    vi.mocked(embedQuery).mockResolvedValue([0.1, 0.2]);
    const stub = makeSupabaseStub({
      data: null,
      error: { message: "boom" },
    });
    vi.mocked(getServerSupabase).mockReturnValue(stub as never);
    const result = await retrieve("anything");
    expect(result).toEqual([]);
  });

  it("uses default topK=8 when not specified", async () => {
    vi.mocked(embedQuery).mockResolvedValue([0.1, 0.2]);
    const stub = makeSupabaseStub({ data: [], error: null });
    vi.mocked(getServerSupabase).mockReturnValue(stub as never);

    await retrieve("question");

    expect(stub.rpc).toHaveBeenCalledWith(
      "match_chunks",
      expect.objectContaining({ match_count: 8, min_score: 0 }),
    );
  });
});

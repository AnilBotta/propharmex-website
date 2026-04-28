/**
 * @propharmex/lib/rag — RAG pipeline public exports (Prompt 18).
 *
 * Surface area kept intentionally small. Sources are not re-exported here
 * because they import from apps/web/content/* — pulling them through this
 * barrel would couple the package's public surface to app content. Source
 * extractors are imported directly by the ingest script.
 */
export {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
  type Chunk,
  type ContentType,
  type IngestSource,
  type MatchChunkRow,
  type RagChunkRow,
  type RetrievedChunk,
} from "./types";

export {
  buildChunkId,
  chunkSection,
  chunkSections,
  type ChunkInput,
} from "./chunker";

export { embedQuery, embedTexts } from "./embedder";

export { retrieve, type RetrieveOptions } from "./retrieve";

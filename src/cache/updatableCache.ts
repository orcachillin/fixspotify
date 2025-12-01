// updatableCache.ts

import Cache from "./cache.js";

type nullish = null | undefined;

export default class UpdateableCache<CachedType, CacheKey = string> extends Cache<CachedType, CacheKey> {
  private _updateMethod: (key: CacheKey) => Promise<CachedType | nullish>;

  constructor(
    updateMethod: (key: CacheKey) => Promise<CachedType | nullish>,
    options?: {
      prune?: boolean;
      limitFactor?: number;
      limitBy?: "time" | "size";
      staleDataThreshold?: number;
    }
  ) {
    super(
      options?.limitBy || "time",
      options?.limitFactor ? options.limitFactor : options?.limitBy === "size" ? 100 : 600000,
      {
        prune: options?.prune,
        staleDataThreshold: options?.staleDataThreshold,
      }
    );
    this._updateMethod = updateMethod;
  }

  public async getOrFetch(key: CacheKey): Promise<CachedType | undefined> {
    const value = this.get(key);
    if (value) {
      return value;
    }
    return this.forceGet(key);
  }

  public async forceGet(key: CacheKey): Promise<CachedType | undefined> {
    const value = await this._updateMethod(key);
    if (value) {
      this.set(key, value);
    } else {
      this.delete(key);
    }
    return value || undefined;
  }
}

// cache.ts

export default class Cache<CachedType, CacheKey = string> {
    private _cache: Map<
        CacheKey,
        {
            value: CachedType;
            lastAccess: number;
            lastUpdate: number;
            accessCount?: number;
        }
    > = new Map();

    private _limitBy: "time" | "size" = "time";
    private _limitFactor: number = 100;
    private _limitTimer?: NodeJS.Timeout;
    private _lastPrune: number = Date.now();
    private _pruneEnabled: boolean = true;
    private _staleDataThreshold: number;
    private _hits: number = 0;
    private _misses: number = 0;

    /**
     * Creates a new cache Storage.
     * @param limitBy The way to limit the cache. Either by time or size.
     * @param limit The limit of the cache. Either in milliseconds or number of items.
     * @param options Options for the cache.
     * @param options.prune Whether to prune the cache or not.
     * @param options.staleDataThreshold The number of times a value can be accessed before it is considered stale.
     */
    constructor();
    constructor(limitBy: "time" | "size");
    constructor(limitBy: "time" | "size", limit: number);
    constructor(limitBy: "time" | "size", limit: number, options: { prune?: boolean, staleDataThreshold?: number });
    constructor(
        limitBy?: string,
        limit?: number,
        options?: {
            prune?: boolean;
            staleDataThreshold?: number;
        }
    ) {
        switch (limitBy) {
            case "time":
                this._limitBy = "time";
                this._limitFactor = limit || 600000; // 10 minutes

                this._limitTimer = setInterval(() => {
                    this.prune();
                    this._lastPrune = Date.now();
                }, this._limitFactor);

                this._pruneEnabled = options?.prune ?? true;
                break;
            case "size":
                this._limitBy = "size";
                this._limitFactor = limit || 100;
                this._pruneEnabled = false;
                break;
        }

        this._staleDataThreshold = options?.staleDataThreshold ?? 10;
    }

    set limitBy(limitBy: "time" | "size") {
        this._limitBy = limitBy;
        if (this._limitBy === "time") {
            this._limitTimer = setInterval(() => {
                this.prune();
            }, this._limitFactor);
        } else {
            clearInterval(this._limitTimer!);
        }
    }

    set limitFactor(limitFactor: number) {
        this._limitFactor = limitFactor;
        if (this._limitBy === "time") {
            this._limitTimer = setInterval(() => {
                this.prune();
            }, this._limitFactor);
        }
    }

    public get(key: CacheKey): CachedType | undefined {
        if (!this._cache.has(key)) {
            this._misses++;
            return undefined;
        }
        const value = this._cache.get(key)!;
        value.lastAccess = Date.now();
        value.accessCount = value.accessCount ? value.accessCount + 1 : 1;

        if (value.accessCount > this._staleDataThreshold && this._staleDataThreshold !== -1) {
            this._cache.delete(key);
            this._misses++;
            return undefined;
        }

        this._hits++;
        return value.value;
    }

    public set(key: CacheKey, value: CachedType): void {
        if (this._cache.has(key)) {
            this._cache.get(key)!.lastUpdate = Date.now();
            this._cache.get(key)!.value = value;
        } else {
            this._cache.set(key, {
                value,
                lastAccess: Date.now(),
                lastUpdate: Date.now(),
            });
        }
    }

    public setMany(...values: ([CacheKey, CachedType])[]): void {
        values.forEach((value) => {
            this.set(value[0], value[1]);
        });
    }

    public delete(key: CacheKey): void {
        this._cache.delete(key);
    }

    public clear(): void {
        this._cache.clear();
    }

    public has(key: CacheKey): boolean {
        return this._cache.has(key);
    }

    public prune(timeAgo?: number) {
        if (!this._pruneEnabled) return;

        if (this._limitBy == "time") {
            this._cache.forEach((value, key) => {
                if (value.lastAccess < Date.now() - (timeAgo || this._limitFactor * 2)) {
                    this._cache.delete(key);
                }
            });
        } else {
            let cacheState = this._cache.size;
            if (cacheState < this._limitFactor) return;
            for (let [key] of this._cache) {
                if (cacheState < this._limitFactor) break;
                this._cache.delete(key);
                cacheState;
            }
        }
    }

    public info() {
        return {
            size: this._cache.size,
            limitBy: this._limitBy,
            limitFactor: this._limitFactor,
            pruneEnabled: this._pruneEnabled,
            staleDataThreshold: this._staleDataThreshold,
            lastPrune: this._lastPrune,
            requests: this._hits + this._misses,
            hits: this._hits,
            misses: this._misses,
            hitRate: this._hits / (this._hits + this._misses),
        };
    }
}

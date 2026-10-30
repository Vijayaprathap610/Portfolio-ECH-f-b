import { useCallback, useEffect, useRef, useState } from "react";

// Global in-memory hook cache to eliminate re-fetch delay when navigating
const hookCache = new Map();

/**
 * High-performance data-fetching hook with instant in-memory cache and background revalidation.
 */
const useFetch = (apiFunc, params = null) => {
    // Generate a cache key
    const fnKey = apiFunc?.name || apiFunc?.toString() || "fetcher";
    const cacheKey = `${fnKey}_${JSON.stringify(params || {})}`;

    const [data, setData] = useState(() => {
        if (hookCache.has(cacheKey)) {
            return hookCache.get(cacheKey);
        }
        return null;
    });
    const [loading, setLoading] = useState(() => !hookCache.has(cacheKey));
    const [error, setError] = useState(null);

    const apiFuncRef = useRef(apiFunc);
    useEffect(() => {
        apiFuncRef.current = apiFunc;
    });

    const paramsRef = useRef(params);
    useEffect(() => {
        paramsRef.current = params;
    });

    const fetchData = useCallback(async (bypassCache = false) => {
        // If we don't have cached data, trigger loading state
        if (!hookCache.has(cacheKey) || bypassCache) {
            setLoading(true);
        }
        setError(null);
        try {
            const fn = apiFuncRef.current;
            const p = paramsRef.current;
            const res = p !== null && p !== undefined ? await fn(p) : await fn();
            const resData = res?.data;
            setData(resData);
            hookCache.set(cacheKey, resData);
        } catch (err) {
            // If we have cached data, keep it and don't wipe out the screen
            if (!hookCache.has(cacheKey)) {
                setError(err.response?.data?.message || 'Failed to fetch data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [cacheKey]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: () => fetchData(true),
    };
};

export default useFetch;

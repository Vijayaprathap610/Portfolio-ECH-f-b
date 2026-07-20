import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Universal data-fetching hook.
 *
 * Usage variants:
 *   useFetch(apiFunc)                       – call apiFunc() on mount, never refetch
 *   useFetch(apiFunc, params)               – call apiFunc(params) on mount
 *   useFetch(() => apiFunc(x), null, [x])   – closure pattern, re-fetches when x changes
 *
 * The internal ref trick ensures the LATEST apiFunc closure is always used,
 * even when it isn't listed in deps, preventing stale-closure bugs.
 */
const useFetch = (apiFunc, params = null, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Always keep a reference to the most recent apiFunc so the callback
    // never closes over a stale version.
    const apiFuncRef = useRef(apiFunc);
    useEffect(() => {
        apiFuncRef.current = apiFunc;
    });

    const paramsRef = useRef(params);
    useEffect(() => {
        paramsRef.current = params;
    });

    // fetchData is only recreated when the caller's declared deps change.
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fn = apiFuncRef.current;
            const p = paramsRef.current;
            const res = p !== null ? await fn(p) : await fn();
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
        // deps is passed through deliberately — caller controls when fetchData is recreated.
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
    }, deps);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;
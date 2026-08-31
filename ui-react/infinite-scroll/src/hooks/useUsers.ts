import { useCallback, useMemo, useState } from "react";
import type { User } from "../types";
import useFetch from "./useFetch";

interface UseUsersReturn {
  users: Array<User>;
  isLoading: boolean;
  error: string | null;
  fetchNext: () => void;
}

export default function useUsers(): UseUsersReturn {
  const [page, setPage] = useState(0);
  const params = useMemo(() => ({ page: page.toString() }), [page]);
  const { isLoading, error, data } = useFetch<{
    users: Array<User>;
    total: number;
  }>("/users", params, true);

  const fetchNext = useCallback(() => {
    if (data?.users.length >= data?.total) return;
    setPage((prvPage) => prvPage + 1);
  }, [data?.total, data?.users]);

  return {
    isLoading,
    error,
    fetchNext,
    users: data.users,
  };
}

"use client";

import useSWR from "swr";
import { qaApi } from "@/lib/api/qa";

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR(
    "projects",
    () => qaApi.listProjects(),
  );

  return {
    projects: data?.projects || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh: mutate,
  };
}

"use client";

import useSWR from "swr";
import { qaApi } from "@/lib/api/qa";

export function useProjectFiles(projectPath: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    projectPath ? ["project-files", projectPath] : null,
    () => qaApi.listProjectFiles(projectPath!),
  );

  return {
    files: data?.files || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh: mutate,
  };
}

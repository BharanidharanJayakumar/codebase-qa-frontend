"use client";

import useSWR from "swr";
import { qaApi } from "@/lib/api/qa";

export function useFileContent(filePath: string | null, projectPath?: string) {
  const { data, error, isLoading } = useSWR(
    filePath ? ["file-content", filePath, projectPath] : null,
    () => qaApi.getFileContent(filePath!, projectPath),
  );

  return {
    content: data?.content || "",
    symbols: data?.symbols || [],
    keywords: data?.keywords || [],
    extension: data?.extension || "",
    isLoading,
    error,
  };
}

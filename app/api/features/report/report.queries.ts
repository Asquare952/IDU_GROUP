import { useMutation } from "@tanstack/react-query";
import { reportingApi, CreateReportPayload, Report } from "./report.api";

export const useFileReport = () => {
  return useMutation<Report, Error, CreateReportPayload>({
    mutationFn: reportingApi.fileReport,
  });
};

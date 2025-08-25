// types/app.d.ts
declare module '@env' {}

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Tabs: undefined;
      JobDetails: { id: string };
      JobApplicants: { jobId: string };
    }
  }
}
export {};

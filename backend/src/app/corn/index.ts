import { healthScoreJob } from "./jobs/health-score.job";


export const initCrons = () => {
  console.log('Initializing scheduled jobs...');
  healthScoreJob.start()
};
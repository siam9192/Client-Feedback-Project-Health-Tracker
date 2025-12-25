import cron from 'node-cron';
import { ProjectModel } from '../../modules/project/project.model';
import { ProjectStatus } from '../../modules/project/project.interface';
import projectService from '../../modules/project/project.service';

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

export const healthScoreJob = cron.schedule('*/30 * * * *', async () => {
  const startTime = new Date().toLocaleTimeString();
  console.log(`[Cron] Health Score Update started at: ${startTime}`);

  try {
    // Only fetch active projects 
    const activeProjects = await ProjectModel.find({ 
      status: { $in: [ProjectStatus.ON_TRACK, ProjectStatus.AT_RISK, ProjectStatus.CRITICAL] } 
    }).select('_id');

  
    await Promise.all(activeProjects.map(project => 
      projectService.updateProjectHealthScore(project._id.toString())
    ));

    console.log(`[Cron] Successfully updated ${activeProjects.length} projects.`);
  } catch (error) {
    console.error('[Cron Error] Health Update Failed:', error);
  }
});
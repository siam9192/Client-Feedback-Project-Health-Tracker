// const group = await ProjectModel.aggregate([
//     // 1️⃣ lookup client
//     {
//       $lookup: {
//         from: "clients",
//         localField: "clientId",
//         foreignField: "_id",
//         as: "client"
//       }
//     },
//     {
//       $unwind: {
//         path: "$client",
//         preserveNullAndEmptyArrays: true
//       }
//     },

//     //  lookup employees
//     {
//       $lookup: {
//         from: "employees",
//         localField: "employees.employee",
//         foreignField: "_id",
//         as: "employeeDetails"
//       }
//     },

   
//     {
//       $addFields: {
//         employees: {
//           $map: {
//             input: "$employees",
//             as: "emp",
//             in: {
//               _id: "$$emp.employee",
//               employee: {
//                 $arrayElemAt: [
//                   {
//                     $filter: {
//                       input: "$employeeDetails",
//                       as: "ed",
//                       cond: { $eq: ["$$ed._id", "$$emp.employee"] }
//                     }
//                   },
//                   0
//                 ]
//               }
//             }
//           }
//         }
//       }
//     },

   
//     {
//       $project: {
//         employeeDetails: 0
//       }
//     },

//     // 5️ group by health status
//     {
//       $group: {
//         _id: "$status",
//         projects: {
//           $push: {
//             _id: "$_id",
//             name: "$name",
//             description: "$description",
//             startDate: "$startDate",
//             endDate: "$endDate",
//             status: "$status",
//             healthScore: "$healthScore",
//             client: "$client",
//             employees: "$employees",
//             createdAt: "$createdAt",
//             updatedAt: "$updatedAt"
//           }
//         }
//       }
//     }
//   ]);



//   async getPendingCheckIns(authUser: AuthUser) {
//   const { weekNumber, year } = getCurrentWeek();
//   const employeeId = objectId(authUser.profileId);

//   // 1️ Get active projects for employee
//   const projects = await ProjectModel.find({
//     employees: employeeId,
//     status: { $ne: ProjectStatus.COMPLETED },
//   })
//     .select("_id name status healthScore startAt endAt")

//     .lean();

//   if (!projects.length) return [];

//   const projectIds = projects.map(p => p._id);

//   //  Get submitted check-ins for this week
//   const submittedCheckIns = await EmployeeCheckInModel.find({
//     employee: employeeId,
//     project: { $in: projectIds },
//     week: weekNumber,
//     year,
//   })
//     .select("project")
//     .lean();

//   //  Convert submitted project IDs 
//   const submittedProjectIds = new Set(
//     submittedCheckIns.map(ci => ci.project.toString())
//   );

//   // Filter pending projects
//   const pendingProjects = projects.filter(
//     project => !submittedProjectIds.has(project._id.toString())
//   );

//   return pendingProjects;
//   }


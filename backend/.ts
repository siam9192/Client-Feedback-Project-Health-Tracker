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
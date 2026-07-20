// import { AccessApiResponseSchema } from "@/model/access";
// import { GenericRequestSchema, GenericResponseSchema } from "@/model/generic";
// import ApiClient from "@/network/api-client";
// import notification from "@/utills/notification";

// class AccessApiProvider {
//   async fetchAccess(params: GenericRequestSchema, signal: AbortSignal) {
//     try {
//       const result = await ApiClient.get<AccessApiResponseSchema | null>(
//         "customer/access",
//         {
//           params,
//           signal,
//         }
//       );
//       const statusCode = result.status ?? 0;
//       const message = result.data?.message ?? "Something went wrong";
//       if (statusCode === 200 || statusCode === 201) {
//         return result;
//       } else {
//         notification.showAlertNotification(message, false);
//         return null;
//       }
//     } catch (error) {
//       if (signal.aborted) {
//         console.warn("Previous Request Was Cancelled");
//       } else {
//         notification.showAxiosErrorAlert(error);
//         return null;
//       }
//     }
//   }

//   //fetch user or userGroup based on user type id
//   async fetchUsers(params: any) {
//     try {
//       const result = await ApiClient.get<any | null>("customer/user/access", {
//         params,
//       });
//       const statusCode = result.status ?? 0;
//       const message = result.data?.message ?? "Something went wrong";
//       if (statusCode === 200 || statusCode === 201) {
//         return result;
//       } else {
//         notification.showAlertNotification(message, false);
//         return null;
//       }
//     } catch (error) {
//       notification.showAxiosErrorAlert(error);
//       return null;
//     }
//   }

//   //fetch lock or lockGroup based on lock type id
//   async fetchLocks(params: any) {
//     try {
//       const result = await ApiClient.get<any | null>("customer/lock/access", {
//         params,
//       });
//       const statusCode = result.status ?? 0;
//       const message = result.data?.message ?? "Something went wrong";
//       if (statusCode === 200 || statusCode === 201) {
//         return result;
//       } else {
//         notification.showAlertNotification(message, false);
//         return null;
//       }
//     } catch (error) {
//       notification.showAxiosErrorAlert(error);
//       return null;
//     }
//   }

//   async createAccess(data: any) {
//     try {
//       const result = await ApiClient.post<GenericResponseSchema | null>(
//         "customer/access",
//         data
//       );
//       const statusCode = result.status ?? 0;
//       let message = result.data?.message ?? "Something went wrong";
//       if (statusCode === 200 || statusCode === 201) {
//         message = "Access created successfully";
//         notification.showAlertNotification(message, true);
//         return result;
//       } else {
//         notification.showAlertNotification(message, false);
//         return null;
//       }
//     } catch (error) {
//       notification.showAxiosErrorAlert(error);
//       return null;
//     }
//   }

//   async removeAccess(data: any) {
//     try {
//       const result = await ApiClient.delete<GenericResponseSchema | null>(
//         "customer/access",
//         { params: data }
//       );
//       const statusCode = result.status ?? 0;
//       let message = result.data?.message ?? "Something went wrong";
//       if (statusCode === 200 || statusCode === 201) {
//         message = "Access removed successfully";
//         notification.showAlertNotification(message, true);
//         return result;
//       } else {
//         notification.showAlertNotification(message, false);
//         return null;
//       }
//     } catch (error) {
//       notification.showAxiosErrorAlert(error);
//       return null;
//     }
//   }

//   async checkAccessName(name: any) {
//     try {
//       const result = await ApiClient.post<GenericResponseSchema | null>(
//         `customer/access/checkNameExists?name=${name}`
//       );
//       const statusCode = result.status ?? 0;
//       let message = result.data?.message ?? "Something went wrong";
//       if (statusCode === 200 || statusCode === 201) {
//         return result;
//       } else {
//         notification.showAlertNotification(message, false);
//         return null;
//       }
//     } catch (error) {
//       notification.showAxiosErrorAlert(error);
//       return null;
//     }
//   }
// }

// const accessApiProvider = new AccessApiProvider();

// export default accessApiProvider;

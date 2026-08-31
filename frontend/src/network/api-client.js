// // import axios from "axios";
// // import { API_URL } from "../utills/utills";

// // const BASE = (API_URL || "").replace(/\/+$/, "");

// // const ApiClient = axios.create({
// //   baseURL: BASE,
// //   timeout: 20000,
// // });

// // // REQUEST INTERCEPTOR
// // ApiClient.interceptors.request.use(
// //   (config) => {
// //     // Attach token
// //     console.log("Axios request config:", config);
// //     const token = localStorage.getItem("token");
// //     if (token) {
// //       config.headers = {
// //         ...config.headers,
// //         Authorization: `Token ${token}`,
// //         Accept: "application/json",
// //         "Content-Type": "application/json",
// //       };
// //     }

// //     /**
// //      * ⭐ IMPORTANT ⭐
// //      * Many enterprise backends accept GET requests with a request body.
// //      * We convert GET + params → GET + data (payload shown in Network tab)
// //      */
// //     if (config.method === "get" && config.params) {
// //       config.data = config.params;  // move params to payload
// //       delete config.params;
// //     }

// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // // RESPONSE INTERCEPTOR
// // ApiClient.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response) {
// //       const status = error.response.status;

// //       if (status === 401 || status === 403) {
// //         localStorage.removeItem("token");
// //         localStorage.removeItem("user");
// //         window.location.href = "/signin";
// //       }
// //     } else {
// //       console.error("Network error (no response)", error);
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// // export default ApiClient;
// import axios from "axios";
// import { API_URL } from "../utills/utills";

// const BASE = (API_URL || "").replace(/\/+$/, "");

// const ApiClient = axios.create({
//   baseURL: BASE,
//   timeout: 20000,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });

// // REQUEST INTERCEPTOR
// ApiClient.interceptors.request.use(
//   (config) => {
//     console.log("Axios request:", config.method?.toUpperCase(), config.url);

//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Token ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // RESPONSE INTERCEPTOR
// ApiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const status = error.response.status;

//       if (status === 401 || status === 403) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         window.location.href = "/signin";
//       }
//     } else {
//       console.error("Network error", error);
//     }

//     return Promise.reject(error);
//   }
// );

// export default ApiClient;
import axios from "axios";
import { API_URL } from "../utills/utills";

const BASE = (API_URL || "").replace(/\/+$/, "");

const ApiClient = axios.create({
  baseURL: BASE,
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR
ApiClient.interceptors.request.use(
  (config) => {
    console.log("Axios request:", config.method?.toUpperCase(), config.url);

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Only add Content-Type for requests that send a JSON body.
    // GET/DELETE have no body — sending Content-Type causes Django to return 400.
    const method = config.method?.toLowerCase();
    if (["post", "put", "patch"].includes(method) && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      }
    } else {
      console.error("Network error", error);
    }

    return Promise.reject(error);
  }
);

export default ApiClient;
"use client";

import axios from "axios";
import { createSlice, createAsyncThunk, Draft } from "@reduxjs/toolkit";
// import { BASE_URL } from "constants";
import { BASE_URL } from "@/constants";

interface ApiOptions<T, R> {
  get?: () => Promise<R>;
  post?: (data: T) => Promise<R>;
  patch?: (data: T) => Promise<R>;
  put?: (data: T) => Promise<R>;
  delete?: (data: T) => Promise<R>;
}

const getApi = <T, R>(endPoint: string): ApiOptions<T, R> => {
  const url = `${BASE_URL.replace(/\/+$/, "")}/${endPoint.replace(/^\/+/, "")}`;

  return {
    get: async () => {
      const token = await localStorage.getItem("token");
      const headers: { Authorization?: string; "Content-Type": string } = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const options = {
        url,
        method: "get",
        headers: headers,
      };

      console.log("GET----", options);

      return axios(options).then((response) => response.data);
    },
    post: async (data: T) => {
      const token = await localStorage.getItem("token");
      const headers: { Authorization?: string; "Content-Type"?: string } = {};
      if (data instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      } else {
        headers["Content-Type"] = "application/json";
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const options = {
        url,
        method: "post",
        data,
        headers: headers,
      };
      console.log("POST----", options);
      return axios(options).then((response) => response.data);
    },
    patch: async (data: T) => {
      const token = await localStorage.getItem("token");
      const headers: { Authorization?: string; "Content-Type"?: string } = {};
      if (data instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      } else {
        headers["Content-Type"] = "application/json";
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const options = {
        url,
        method: "patch",
        data,
        headers: headers,
      };
      console.log("PATCH----", options);
      return axios(options).then((response) => response.data);
    },
    put: async (data: T) => {
      const token = await localStorage.getItem("token");
      const headers: { Authorization?: string; "Content-Type"?: string } = {};
      if (data instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      } else {
        headers["Content-Type"] = "application/json";
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const options = {
        url,
        method: "put",
        data,
        headers: headers,
      };
      console.log("PUT----", options);
      return axios(options).then((response) => response.data);
    },
    delete: async (data: T) => {
      const token = await localStorage.getItem("token");
      const headers: { Authorization?: string; "Content-Type": string } = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const options = {
        url,
        method: "delete",
        data,
        headers: headers,
      };
      console.log("DELETE----", options);
      return axios(options).then((response) => response.data);
    },
  };
};

interface SliceState<R> {
  loading: boolean;
  successData?: R | null;
  error: boolean;
  errorInfo?: string | null;
}

type ExtendedData<T> = T & {
  endPoint?: string;
};

function isExtendedData<T>(data: T | ExtendedData<T>): data is ExtendedData<T> {
  return (
    typeof data === "object" &&
    data !== null &&
    ("serverCall" in data || "endPoint" in data)
  );
}

export default function sliceCreator<T extends object | undefined, R>(
  sliceName: string,
  endPoint: string,
  method: keyof ApiOptions<T, R>
) {
  const asyncAction = createAsyncThunk<
    R,
    T | ExtendedData<T> | FormData | void,
    { rejectValue: { error: string; statusCode: number } }
  >(
    `${sliceName} / ${method}`.toUpperCase(),
    async (data = {} as T, { rejectWithValue }) => {
      let finalEndpoint = endPoint;
      try {
        // ✅ Handle FormData endpoint extraction
        if (data instanceof FormData) {
          const epFromForm = data.get("endPoint");
          if (typeof epFromForm === "string" && epFromForm.trim() !== "") {
            finalEndpoint = epFromForm;
            data.delete("endPoint"); // optional: remove it so it’s not sent in payload
          }
        }
        // ✅ Handle ExtendedData object type
        else if (isExtendedData(data) && data.endPoint) {
          finalEndpoint = data.endPoint;
          delete data.endPoint;
        }

        const apiInstance = getApi<T, R>(finalEndpoint);
        const methodFn = apiInstance[method];

        if (!methodFn) {
          throw new Error(`Method ${method} not supported`);
        }

        const response = await methodFn(data as T);

        return response;

      } catch (err: any) {
        // if 401 — only force logout if it's NOT the login endpoint itself
        if (err.response?.status === 401 && !finalEndpoint.includes("login")) {
          if (typeof window !== "undefined") {
            localStorage.clear();
            window.location.href = "/login";
            console.log("Unauthorized. Logging out.");
          }
          return rejectWithValue({
            error: "Unauthorized. Logging out.",
            statusCode: 401,
          });
        }
        console.error("API Error:", err);
        const errorMessage =
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.response?.data?.data ??
          err.message ??
          "An error occurred";
        return rejectWithValue({
          error: errorMessage,
          statusCode: err.response?.status ?? 500,
        });
      }
    }
  );

  const clearData = `${method.toUpperCase()}/clear`;

  const initialState: SliceState<R> = {
    loading: false,
    successData: null,
    error: false,
    errorInfo: null,
  };

  const slice = createSlice({
    name: sliceName.toUpperCase(),
    initialState: initialState,
    reducers: {
      [clearData]: () => ({} as SliceState<R>),
    },
    extraReducers: (builder) => {
      builder.addCase(asyncAction.pending, (state) => {
        state.loading = true;
        state.successData = null;
        state.error = false;
        state.errorInfo = null;
      });
      builder.addCase(asyncAction.rejected, (state, action) => {
        // (state, action: PayloadAction<any>) => {
        console.log(action);
        state.loading = false;
        state.successData = null;
        state.error = true;
        state.errorInfo = action.payload?.error ?? action.error?.message ?? "An error occurred";
      });
      builder.addCase(asyncAction.fulfilled, (state, action) => {
        // (state, action: PayloadAction<R | undefined>) => {
        state.loading = false;
        state.successData =
          action.payload !== undefined ? (action.payload as Draft<R>) : null;
        state.error = false;
        state.errorInfo = null;
      });
    },
  });

  return {
    reducer: slice.reducer,
    asyncAction: asyncAction,
    clearData: slice.actions[clearData],
  };
}

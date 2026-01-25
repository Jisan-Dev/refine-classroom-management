import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { HttpError } from "@refinedev/core";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

if (!BACKEND_BASE_URL) {
  throw new Error("BACKEND_BASE_URL is not defined in environment variables.");
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = "Request failed!";

  try {
    const payload = (await response.json()) as { message?: string };

    if (payload?.message) message = payload.message;
  } catch {
    // ignore errors
  }

  return {
    message,
    statusCode: response.status,
  };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter?.value);

        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload?.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload?.pagination?.total ?? payload?.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };

// MOCK DATA PROVIDER - IGNORE (FOR REFERENCE ONLY)
// import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";
// import { Subject } from "../types";

// const subjects: Subject[] = [
//   {
//     id: 1,
//     name: "Introduction to Computer Science",
//     code: "CS101",
//     description:
//       "A foundational course on the principles of computer science, covering topics like algorithms, data structures, and programming concepts.",
//     department: "Computer Science",
//   },
//   {
//     id: 2,
//     name: "Principles of Microeconomics",
//     code: "ECON201",
//     description:
//       "An introductory course on microeconomic theory, including supply and demand, market structures, and consumer behavior.",
//     department: "Economics",
//   },
//   {
//     id: 3,
//     name: "Introduction to Psychology",
//     code: "PSY101",
//     description:
//       "A survey of the major topics in psychology, including cognitive processes, social behavior, and human development.",
//     department: "Psychology",
//   },
// ];

// export const dataProvider: DataProvider = {
//   getList: async <TData extends BaseRecord = BaseRecord>({
//     resource,
//   }: GetListParams): Promise<GetListResponse<TData>> => {
//     if (resource !== "subjects") return { data: [] as TData[], total: 0 };

//     return { data: subjects as unknown as TData[], total: subjects.length };
//   },

//   getOne: async () => {
//     throw new Error("This method is not implemented.");
//   },
//   create: async () => {
//     throw new Error("This method is not implemented.");
//   },
//   update: async () => {
//     throw new Error("This method is not implemented.");
//   },
//   deleteOne: async () => {
//     throw new Error("This method is not implemented.");
//   },

//   getApiUrl: () => "",
// };

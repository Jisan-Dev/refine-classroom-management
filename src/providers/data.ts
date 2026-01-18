// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";
import { Subject } from "../types";

const subjects: Subject[] = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    description:
      "A foundational course on the principles of computer science, covering topics like algorithms, data structures, and programming concepts.",
    department: "Computer Science",
  },
  {
    id: 2,
    name: "Principles of Microeconomics",
    code: "ECON201",
    description:
      "An introductory course on microeconomic theory, including supply and demand, market structures, and consumer behavior.",
    department: "Economics",
  },
  {
    id: 3,
    name: "Introduction to Psychology",
    code: "PSY101",
    description:
      "A survey of the major topics in psychology, including cognitive processes, social behavior, and human development.",
    department: "Psychology",
  },
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") return { data: [] as TData[], total: 0 };

    return { data: subjects as unknown as TData[], total: subjects.length };
  },

  getOne: async () => {
    throw new Error("This method is not implemented.");
  },
  create: async () => {
    throw new Error("This method is not implemented.");
  },
  update: async () => {
    throw new Error("This method is not implemented.");
  },
  deleteOne: async () => {
    throw new Error("This method is not implemented.");
  },

  getApiUrl: () => "",
};

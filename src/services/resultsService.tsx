
import {
    IBaseResponseService,
    IPaginationRequest,
    IPaginationResponse,
  } from "@smpm/models"
  import {
    IFormInputImportResults,
    IResultsModel,
  } from "@smpm/models/resultsModel"
  import axios from "@smpm/services/axios"
  import { saveAs } from "file-saver"
  
  export const getResults = async (
    param: IPaginationRequest
  ): Promise<IBaseResponseService<IPaginationResponse<IResultsModel>>> => {
    const response = await axios.get("/results", {
      params: param,
    })
    return response.data
  }
  
  export const downloadTemplateResults = async () => {
    const response = await axios.get("/results/template/download", {
      responseType: "blob",
    })
  
    const filenameMatch =
      response.headers["content-disposition"].match(/filename=([^;]+)/)
    const filename = filenameMatch
      ? filenameMatch[1].trim()
      : "results-template.xlsx"
  
    saveAs(response.data, filename)
  }
  
  export const downloadTemplateResultsAcknowledge = async () => {
    const response = await axios.get("/results/template-acknowledge/download", {
      responseType: "blob",
    })
  
    const filenameMatch =
      response.headers["content-disposition"].match(/filename=([^;]+)/)
    const filename = filenameMatch
      ? filenameMatch[1].trim()
      : "results-acknowledge-template.xlsx"
  
    saveAs(response.data, filename)
  }
  
  export const uploadResultsNew = async (data: IFormInputImportResults) => {
    const response = await axios.post("/results/bulk/upload", data, {
      headers: { "content-type": "multipart/form-data" },
    })
    return response.data
  }
  
  export const uploadResultsAcknowledge = async (
    data: IFormInputImportResults
  ) => {
    const response = await axios.post("/results/bulk/acknowledge", data, {
      headers: { "content-type": "multipart/form-data" },
    })
    return response.data
  }
  
  export const findResult = async (no_result: string) => {
    const response = await axios.get(`/results/${no_result}/show`)
    return response.data
  }
  
  export const resultsActivity = async (payload: any) => {
    const response = await axios.post(`/results/activity`, payload, {
      headers: { "content-type": "multipart/form-data" },
    })
    return response.data
  }
  
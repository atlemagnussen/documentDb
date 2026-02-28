import { apiService } from "@db/client/services/apiService.js"
import { DocumentDto } from "@db/api"

export function list() {
    return apiService.get<Array<DocumentDto>>("documents")
}

export function get(id: string) {
    return apiService.get<DocumentDto>(`documents/${id}`)
}
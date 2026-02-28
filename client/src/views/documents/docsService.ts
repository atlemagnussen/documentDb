import { apiService } from "@db/client/services/apiService.js"
import { DocumentDto } from "@db/api"

const basePath = "documents"

export function list() {
    return apiService.get<Array<DocumentDto>>(basePath)
}

export function get(id: string) {
    return apiService.get<DocumentDto>(`${basePath}/${id}`)
}

export function update(id: string, doc: DocumentDto) {
    return apiService.put(`${basePath}/${id}`, doc)
}
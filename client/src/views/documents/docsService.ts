import { apiService } from "@db/client/services/apiService.js"
import { DocumentCreateDto, DocumentDto, DocumentUpdateDto } from "@db/api"

const basePath = "documents"

export function list() {
    return apiService.get<Array<DocumentDto>>(basePath)
}

export function get(id: string) {
    return apiService.get<DocumentDto>(`${basePath}/${id}`)
}

export function create(doc: DocumentCreateDto) {
    return apiService.post(basePath, doc)
}

export function update(id: string, doc: DocumentUpdateDto) {
    return apiService.put(`${basePath}/${id}`, doc)
}
import { apiService } from "@db/client/services/apiService.js"
import { DocumentDto } from "@db/api"

export function getUsers() {
    return apiService.get<Array<DocumentDto>>("documents")
}

export function getUser(id: string) {
    return apiService.get<DocumentDto>(`documents/${id}`)
}
import { RouteConfig } from "@lit-labs/router"
import { html } from "lit"

export const routes: Array<RouteConfig> = [
    {
        name: "home",
        path: "/",
        render: () => html`<home-view></home-view>`,
    },
    {
        name: "documents",
        path: "/documents",
        render: () => html`<docs-list></docs-list>`
    },
    {
        name: "documentDetails",
        path: "/documents/:id",
        render: ({id}) => {
            if (!id)
                return html`<p>Loading</p>`
            return html`<doc-details docid="${id}"></doc-details>`
        }
    },
    {
        name: "documentEdit",
        path: "/documents/:id/edit",
        render: ({id}) => {
            if (!id)
                return html`<p>Loading</p>`
            return html`<doc-edit docid="${id}"></doc-edit>`
        }
    },
    {
        name: "notfound",
        path: "*",
        render: () => html`<p>Not found</p>`
    }
]


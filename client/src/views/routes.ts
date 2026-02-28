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
        render: ({id}) => html`<doc-details id="${id}"></doc-details>`
    },
    {
        name: "notfound",
        path: "*",
        render: () => html`<p>Not found</p>`
    }
]


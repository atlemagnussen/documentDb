import { DocumentListDto } from "@db/api"
import {css, html} from "lit"
import {customElement, state} from "lit/decorators.js"
import * as docService from "@db/client/views/documents/docsService.js"
import { AuthUserElement } from "@db/client/components/AuthUserElement.js"

@customElement("docs-list")
export class UsersList extends AuthUserElement {

	static styles = css`
		tbody { 
			color: var(--wa-color-text-normal);
			tr:nth-child(odd) {
				background-color: var(--wa-color-surface-raised);
			}
			tr:nth-child(even) {
				background-color: var(--wa-color-surface-lowered);
			}
			tr td {
				padding: var(--wa-space-xs);
			}
		}
		button {
			cursor: pointer;
		}
	`
	connectedCallback(): void {
		super.connectedCallback()
		this.get()
	}
	@state()
	result?: Array<DocumentListDto>

	@state()
	showStorage = false

	toggleShowStorage() {
		this.showStorage = !this.showStorage
	}

	get = async () => {
		try {
			const docs = await docService.list()
			this.result = docs
		} catch (err: any) {
			this.error = err
		}
	}

	render() {
		if (!this.result) {
			return html`
			<div>
				<p>No result</p>
				<button @click=${this.get}>Get Dbs</button>
        <error-viewer .error=${this.error}></error-viewer>
			</div>
			`
		}

		return html`
			<section>
				<h3>Docs</h3>
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						${this.result.map(u => {
							return html`
								<tr>
									<td>
                    <a href="/documents/${u.id}">
                      ${u.title}
                    </a>
                  </td>
									<td>
										<wa-button href="/documents/${u.id}/edit" variant="neutral" appearance="filled">
											<wa-icon name="pen-to-square" variant="regular"></wa-icon>
										</wa-button>
									</td>
								</tr>
							`
						})}
					</tbody>
				</table>
			</section>
		`
	}
}
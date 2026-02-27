import { DocumentDto } from "@db/api"
import {LitElement, css, html} from "lit"
import {customElement, state} from "lit/decorators.js"
import * as userService from "@db/client/views/documents/docsService.js"


@customElement("users-list")
export class UsersList extends LitElement {

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
	result?: Array<DocumentDto>

	@state()
	showStorage = false

	toggleShowStorage() {
		this.showStorage = !this.showStorage
	}

	get = async () => {
		try {
			const dbs = await userService.getUsers()
			this.result = dbs
		} catch (err: any) {
			this.result = err.message
		}
	}

	render() {
		if (!this.result) {
			return html`
			<div>
				<p>No result</p>
				<button @click=${this.get}>Get Dbs</button>
			</div>
			`
		}

		return html`
			<section>
				<h3>Users</h3>
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
									<td>${u.title}</td>
									<td>
										<wa-button variant="neutral" appearance="filled">
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
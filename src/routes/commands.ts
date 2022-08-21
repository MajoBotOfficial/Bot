import type { PieceContext } from '@sapphire/framework';
import { ApiRequest, ApiResponse, methods, Route, RouteOptions } from '@sapphire/plugin-api';

export class UserRoute extends Route {
	public constructor(context: PieceContext, options?: RouteOptions) {
		super(context, {
			...options,
			route: 'commands'
		});
	}

	public [methods.GET](_request: ApiRequest, response: ApiResponse) {
		response.json({
			data: [...this.container.client.stores.get('commands').values()]
		});
	}
}

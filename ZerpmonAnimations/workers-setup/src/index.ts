/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	ZERPMON_BUCKET: R2Bucket;
}

export default {
	async fetch(
	  request: Request,
	  env: Env,
	  ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);
	
		switch (request.method) {
			case 'PUT':
				await env.ZERPMON_BUCKET.put(key, request.body);
				return new Response(`Put ${key} successfully!`);
			case 'GET':
				const object = await env.ZERPMON_BUCKET.get(key);
				console.log(key)
					
			if (object === null) {
			  return new Response('Object Not Found', { status: 404 });
			}
	
			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set('etag', object.httpEtag);
	
			return new Response(object.body, {
			  headers,
			});
		  case 'DELETE':
			await env.ZERPMON_BUCKET.delete(key);
			return new Response('Deleted!');
	
		  default:
			return new Response('Method Not Allowed', {
			  status: 405,
			  headers: {
				Allow: 'PUT, GET, DELETE',
			  },
			});
		}
	},
  };



  //curl https://workers-setup.xscapenft.workers.dev/zerpmon-spritesheet-json/Dashkey.png -X PUT -F "image=@Dashkey.png"
// import { createProxyMiddleware } from 'http-proxy-middleware';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const proxy = createProxyMiddleware({
//   target: 'https://api.lens.dev',
//   changeOrigin: true,
//   pathRewrite: { '^/api/proxy': '' },
// });

// export default function handler(req, res) {
//   proxy(req, res, (result) => {
//     if (result instanceof Error) {
//       throw result;
//     }
//     throw new Error(`Request '${req.url}' is not proxied! We should never reach here!`);
//   });
// }


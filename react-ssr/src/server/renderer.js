import React from "react";
import { renderToString } from "react-dom/server"
// 服务器端路由配置
import { StaticRouter } from "react-router-dom";
import routes from "../share/routes";
import { renderRoutes } from "react-router-config";
import { Provider } from "react-redux";
// 预防Xss攻击
import serialize from 'serialize-javascript'

export default (req, store) => {
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path}> 
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  )
  // 将服务器端获取到的组件回填数据缓存下来，以便客户端创建store时使用
  const state = serialize(store.getState());
  return `
    <html>
      <head>
        <title>React SSR</title>
      </head>
      <body>
        <div id="root">${content}</div>
        <script>window.INITIAL_STATE=${state}</script>
        <script src="bundle.js"></script>
      </body>
    </html>
  `
}
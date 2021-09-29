import renderer from './renderer'
import createStore from './createStore';
import { matchRoutes } from "react-router-config";
import routes from "../share/routes";
import app from './createApp';

// * 接受任何请求
app.get('*', (req, res) => {
  const store = createStore();
  // 为了获取到当前页面的初始数据。
  const promises = matchRoutes(routes, req.path).map(({ route }) => {
    if (route.loadData) return route.loadData(store);
  })
  // 确保所有的信息都已经获取到
  Promise.all(promises).then(
    () => {
      res.send(renderer(req, store))
    }
  )
})

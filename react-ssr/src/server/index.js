import express from "express";
import renderer from './renderer'
const app = express();
import createStore from './createStore';
import { matchRoutes } from "react-router-config";
import routes from "../share/routes";
app.use(express.static('public')) // 为组件添加事件

app.get('*', (req, res) => {
  const store = createStore();
  const promises = matchRoutes(routes, req.path).map(({ route }) => {
    if (route.loadData) return route.loadData(store);
  })
  Promise.all(promises).then(
    () => {
      res.send(renderer(req, store))
    }
  )
})

app.listen(3000, () => console.log('app is running'))
react服务器端渲染简单示例
1. 基本概念
  1.1 客户端渲染 CSR
    服务器端仅返回JSON数据，DATA和HTML在客户端进行渲染
    缺点：1. 首屏渲染时间长 
          2. 页面结构为空，不利于SEO
  1.2 服务器端渲染 SSR
    服务器端返回HTML，DATA和HTML在服务器端渲染
2. React SSR同构: 在客户端和服务器端都能够使用
3. 给服务器的组件元素附加事件
  3.1 在客户端使用hydrate方法对组件进行渲染
  3.2 为客户端配置webpack并配置启动明亮
  3.3 添加客户端包文件的请求链接
    即在响应给客户端的HTML代码中添加script标签，引入客户端的静态资源
  3.4 服务器端实现静态资源访问
    服务端程序实现静态资源访问功能，客户端JS打包文件会被作为静态资源使用,具体代码:
      app.use(express.static('public'))
4. 配置路由
  4.1 为了同时在客户端和服务器端使用，采用数组形式的路由更加便利
  4.2 服务器端路由
    4.2.1 express路由接受任何请求
    4.2.2 服务器端路由配置
          <StaticRouter location={req.path}>
            {renderRoutes(routes)}
          </StaticRouter> 
  4.3 客户端路由
    4.3.1 添加客户端路由配置
          <BrowserRouter>
            {renderRoutes(routes)}
          </BrowserRouter>
5. 配置Redux
  5.1 共用Reducer和action，但创建store的代码不同。
  5.2 客户端Redux
    与普通CSR使用Redux相同的配置。
    仅有在创建Store时，默认的state使用服务器端获取到的数据
  5.3 服务器端Redux
    5.3.1 在接收到请求的使用创建store
    5.3.2 服务器端在渲染组件之前获取到组件所需要的数据
      5.3.2.1 在组件中添加loadData方法
      5.3.2.2 将loadData方法保存到当前组件的路由对象中
      5.3.2.3 服务器端接收到请求后，根据请求地址匹配出要渲染组件的路由信息
        a. 获取请求地址
        b. 获取路由配置信息
        c. 根据请求地址匹配出要渲染组件的路由信息 matchRoutes
      5.3.3.4 从路由信息中获取组件的loadData方法并调用方法获取组件需要的数据
    5.3.4 将服务器端获取到的数据，回填给客户端的初始状态（即创建store时state）
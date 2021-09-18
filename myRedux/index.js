// enhancer 加强store
// 最常用的有注册中间件 applyMiddleware
function createStore(reducer, preloadState, enhancer) {
  if (typeof reducer !== 'function') throw new Error("reducer必须是一个函数")
  var currentState = preloadState;
  // 用于存储所有的订阅者
  var currentListeners = [];

  // 判断是否有传第三个参数
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') throw new Error("enhancer必须是函数")
    return enhancer(createStore)(reducer, preloadState);
  }
  function getState() {
    return currentState;
  }
  function dispatch(action) {
    if (!isPlainObject(action)) throw new Error("action必须是一个对象")
    if (typeof action.type === 'undefined') throw new Error("action必须需要有type属性")
    currentState = reducer(currentState, action);
    // 状态修改之后，调用所有的订阅者回调函数
    for(var i = 0; i < currentListeners.length; i++) {
      const listener = currentListeners[i];
      listener();
    }
  }
  function subscribe(listener) {
    currentListeners.push(listener)
  }
  return {
    dispatch,
    getState,
    subscribe,
  }
}
// 判断是否是一个对象
function isPlainObject(obj) {
  // 为基础类型或者为null
  if (typeof obj !== 'object' || obj === null) return false;
  const proto = Object.getPrototypeOf(obj);
  while(Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  // 用于区分是数组还是对象,如果是一个数组,则prototype与最顶级的prototype不一样
  return proto === Object.getPrototypeOf(obj);
}
// 合并reducer
function combineReducer(reducers) {
  const reducerKeys = Object.keys(reducers);
  // 1. 判断reducer是函数
  for(var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (typeof reducers[key] !== 'function') throw new Error(`${key} reducer必须是一个函数`)
  }
  // 2.调用reducer，将每个Reducer中返回的状态存储在一个大的对象中
  return function (state, action) {
    var nextState = {};
    for(var i = 0; i < reducerKeys.length; i++) {
      var key = reducerKeys[i];
      var reducer = reducers[key];
      nextState[key] = reducer(state, action);
    }
    return nextState;
  }
}
/**
 * 
 * @param {*} actionCreators 
 * {
 *  [对外可调用的函数名称]: [需要调用的action]
 * }
 * @param {*} dispatch 
 * @returns 
 * {
 *  [对外可调用的函数名称]: () => { dispatch(需要调用的action) }
 * }
 */
function bindActionCreators(actionCreators, dispatch) {
  const boundActionCreators = {}
  for(var key in actionCreators) {
    // 利用自调用，来缓存下当时的key，以确保后面调用时时正确的key。不然调用任何函数都是最后一个函数
    (function(key) {
        boundActionCreators[key] = function() {
        dispatch(actionCreators[key]())
      }
    })(key);
  }
  return boundActionCreators;
}
// 注册中间件，内置的enhancer，返回store，调用方式为enhancer(createStore)(reducer, preload)
// 中间件都是对dispatch进行加强
function applyMiddleware(...middlewares) {
  return function(createStore) {
    return function(reducer, preloadState) {
      var store = createStore(reducer, preloadState);
      const middlewareAPI = {
        dispatch: store.dispatch,
        getState: store.getState,
      }
      // 调用第一层中间件函数
      var chain = middlewares.map(middleware => middleware(middlewareAPI));
      const dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch,
      }
    }
  }
}
function compose() {
  const funs = [...arguments];
  return (dispatch) => {
    for(var i = funs.length - 1; i >= 0; i--) {
      dispatch = funs[i](dispatch)
    }
    return dispatch;
  }
}

// 自定义中间件
function logger(store) {
  return function(next) {
    return function(action) {
      console.log('>>>>logger')
      // next 调用下一个中间件，如果是最后一个则调用的是dispatch
      next(action)
    }
  }
}
// 用于添加处理异步操作的action
function thunk(store) {
  return function(next) {
    return function(action) {
      if (typeof action === 'function') {
        action(next);
      } else {
        next(action);
      }
    }
  }
}
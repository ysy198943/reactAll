export const SET_LIST = 'setList';

export const getList = () => async (dispatch) => {
  // 发送异步请求获得数据
  const list = [{name: 'zhangsan', id: '1'}, { name: 'lisi', id: 2 }]
  dispatch({
    type: SET_LIST,
    payload: list
  })
}
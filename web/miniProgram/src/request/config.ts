// 请求连接前缀
// https://ecology.tencent.com/agent
export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://ecology.tencent.com/agent'
    : 'https://ecology-test.tencentcloudmarket.com/agent';

// 输出日志信息
export const CONSOLE = false;

/**
 * auth: 校验登录token， visit: 校验游客token， 其他：不校验token
 */
export const api = {
  AuthLoginByWeixin: '/loginWechat', // 微信登录
  GetVisitInfo: '/queryAgentUserInfo', // 获取访客信息
  CreateAgentTeam: '/createAgentTeam', // 创建代理商团队
  JoinTeam: '/joinAgentTeam', // 加入团队
  ReportUserInfo: '/visit/reportUserInfo', // 用户浏览数据上报（目前只是商品详情）

  GetGoodsList: '/auth/goodsInfo/pageQuery', // 查询商品列表
  SearchGoods: '/auth/goodsInfo/search', // 查询商品
  SearchSolution: '/auth/agent/goodsInfo/querySolution', // 代理商查询解决方案
  GetReleatedGoods: '/auth/goodsInfo/queryByIDs', // 根据商品ID获取商品列表

  SearchHistory: '/auth/searchHistoryDetail/pageQueryByLoginUser', // 查询搜索历史
  DeleteHistory: '/auth/searchHistoryDetail/clearByLoginUser', // 清空搜索历史
  Feedback: '/auth/feedbacks/insert', // 新增反馈
};

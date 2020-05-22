import Mock from 'mockjs' // 引入mockjs
const host = 'http://www.aixueshu:8888'
const Random = Mock.Random // Mock.Random 是一个工具类，用于生成各种随机数据
const code = 200 // 返回的状态码

const mockData = req => {
  req = JSON.parse(req.body)
  // console.log(req)
  let data = [], // 用于接受生成数据的数组
  page = req.page || 1,
  pageSize = req.pageSize || 10,
  // 数据分页
  len = (100 - pageSize * (page - 1)) < pageSize ? (100 - pageSize * (page - 1)) : pageSize
  for(let i = 0; i < len; i ++) { // 可自定义生成的个数
    let template = {
      id: Random.integer(1, 10),
      title: Random.csentence(10, 25), // 随机生成长度为10-25的标题
      icon: Random.dataImage('250x250', '文章icon'), // 随机生成大小为250x250的图片链接
      author: Random.cname(), // 随机生成名字
      thumb:Random.image('200x200'), //缩略图
      data: Random.date('yyyy'), // 生成一个随机日期,可加参数定义日期格式
      'Image': Random.image('250x250', '#02adea', 'Hello'), // Random.size表示将从size数据中任选一个数据
      color: Random.color(), // 生成一个颜色随机值
      boolean: Random.boolean(),// 生成一个布尔值
      code: Random.integer(0, 9999),// 生成一个整数值（验证码）
      'Paragraph':Random.paragraph(2, 5), //生成2至5个句子的文本
      booktitle: Random.ctitle(), // 生成姓名
      url: Random.url(), // 生成web地址
      address: Random.province() // 生成地址
    }
    data.push(template)
  }
  // 返回状态码和文章数据activelist
  return {
    code,
    data
  }
}

Mock.mock(`${host}/data/index`, 'post', mockData) // 根据数据模板生成模拟数据
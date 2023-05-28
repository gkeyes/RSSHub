// 导入必要的模组
const got = require('@/utils/got'); // 自订的 got
const cheerio = require('cheerio'); // 可以使用类似 jQuery 的 API HTML 解析器
const { parseDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    // 在此处编写您的逻辑
    const baseUrl = 'https://wxapi.qabot.cn/plugin/uplog.php';
    const { data: response } = await got(baseUrl);
    const $ = cheerio.load(response);

    const item = $('div.plugin-list .plugin')
        // 使用“toArray()”方法将选择的所有 DOM 元素以数组的形式返回。
        .toArray()
        // 使用“map()”方法遍历数组，并从每个元素中解析需要的数据。
        .map((item) => {
            item = $(item);
            const a = item.find('.plugin-info').first();
            const pubDate = parseDate(item.find('.similar-score').first().text(), 'YYYY-M-DD');
            return {
                title: item.find('.similar-score').text() + a.find('.plugin-name').text(),
                link: `https://wxapi.qabot.cn${a.attr('href')}`,
                description : a.find('.plugin-description').text(),
                pubDate
            };
        });

    ctx.state.data = {
        // 源标题
        title: '坐倚北风CAE文章',
        // 源链接
        link: 'https://www.leanwind.com/mechatronics/cae',
        // 源文章
        item,
    };
};

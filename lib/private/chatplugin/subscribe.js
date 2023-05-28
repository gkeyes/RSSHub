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
        .filter(function () {
            // 获取元素的类别
            const classNames = $(this).attr('class').split(' ');
            // 检查是否包含 'uplog' 或 'header' 类别
            return !classNames.includes('uplog') && !classNames.includes('header');
        })
        // 使用“toArray()”方法将选择的所有 DOM 元素以数组的形式返回。
        .toArray()
        // 使用“map()”方法遍历数组，并从每个元素中解析需要的数据。
        .map((item) => {
            item = $(item);
            const a = item.find('.plugin-info').first();
            const pubDate = parseDate(item.find('.similar-score').first().text(), 'YYYY-M-DD');
            return {
                title: `${item.find('.similar-score').text()}${a.find('.plugin-name').text()}`,
                link: `https://wxapi.qabot.cn${a.find('.plugin-card').attr('href')}`,
                description : a.find('.plugin-description').text(),
                pubDate
            };
        });

    ctx.state.data = {
        // 源标题
        title: 'Chatplugin 变动追踪',
        // 源链接
        link: 'https://wxapi.qabot.cn/plugin/uplog.php',
        // 源文章
        item,
    };
};

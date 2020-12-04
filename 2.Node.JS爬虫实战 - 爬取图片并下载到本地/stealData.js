class stealData {
  constructor() {
    this.base_url = ''; //要爬取的网站
    this.current_page = 1;
    this.result_list = [];
  }

  async init() {
    try {
      await this.getPageData();
      await this.downLoadPictures();
    } catch (e) {
      console.log(e);
    }
  }

  sleep(time) {
    return new Promise((resolve) => {
      console.log(`自动睡眠中，${time / 1000}秒后重新发送请求......`);
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  async getPageData() {
    const target_url = this.base_url;
    try {
      const res = await axios.get(target_url);
      const html = res.data;
      const $ = cheerio.load(html);
      const result_list = [];
      $('.newscon').each((index, element) => {
        result_list.push({
          title: $(element).find('.newsintroduction').text(),
          down_loda_url: $(element).find('img').attr('src').split('!')[0],
        });
      });
      this.result_list.push(...result_list);
      return Promise.resolve(result_list);
    } catch (e) {
      console.log('获取数据失败');
      return Promise.reject(e);
    }
  }

  async downLoadPictures() {
    const result_list = this.result_list;
    try {
      for (let i = 0, len = result_list.length; i < len; i++) {
        console.log(`开始下载第${i + 1}张图片!`);
        await this.downLoadPicture(result_list[i].down_loda_url);
        await this.sleep(3000 * Math.random());
        console.log(`第${i + 1}张图片下载成功!`);
      }
      return Promise.resolve();
    } catch (e) {
      console.log('写入数据失败');
      return Promise.reject(e);
    }
  }

  async downLoadPicture(href) {
    try {
      const target_path = path.resolve(
        __dirname,
        `./cache/image/${href.split('/').pop()}`
      );
      const response = await axios.get(href, { responseType: 'stream' });
      await response.data.pipe(fs.createWriteStream(target_path));
      console.log('写入成功');
      return Promise.resolve();
    } catch (e) {
      console.log('写入数据失败');
      return Promise.reject(e);
    }
  }
}

const thief = new stealData('xxx_url');
thief.init();

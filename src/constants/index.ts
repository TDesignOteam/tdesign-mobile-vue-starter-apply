import type { City, CityGroup, ShareActionSheetData } from '@/types/interface';

export enum ContentTypeEnum {
  Json = 'application/json;charset=UTF-8',
  FormURLEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
  FormData = 'multipart/form-data;charset=UTF-8',
}

// 按字母分组的城市列表
export const cityGroup: CityGroup = {
  热门城市: [
    { value: '北京市', label: '北京' },
    { value: '上海市', label: '上海' },
    { value: '广州市', label: '广州' },
    { value: '深圳市', label: '深圳' },
    { value: '成都市', label: '成都' },
    { value: '杭州市', label: '杭州' },
    { value: '武汉市', label: '武汉' },
    { value: '西安市', label: '西安' },
  ],
  A: [
    { value: '澳门', label: '澳门特别行政区' },
    { value: '阿克苏市', label: '阿克苏' },
    { value: '安吉市', label: '安吉' },
    { value: '鞍山市', label: '鞍山' },
    { value: '安庆市', label: '安庆' },
    { value: '安阳市', label: '安阳' },
  ],
  B: [
    { value: '北京市', label: '北京' },
    { value: '保定市', label: '保定' },
    { value: '包头市', label: '包头' },
    { value: '宝鸡市', label: '宝鸡' },
    { value: '北海市', label: '北海' },
  ],
  C: [
    { value: '成都市', label: '成都' },
    { value: '重庆市', label: '重庆' },
    { value: '长沙市', label: '长沙' },
    { value: '长春市', label: '长春' },
    { value: '常州市', label: '常州' },
    { value: '沧州市', label: '沧州' },
    { value: '常德市', label: '常德' },
  ],
  D: [
    { value: '大连市', label: '大连' },
    { value: '东莞市', label: '东莞' },
    { value: '大庆市', label: '大庆' },
    { value: '大同市', label: '大同' },
    { value: '德阳市', label: '德阳' },
    { value: '德州市', label: '德州' },
  ],
  E: [
    { value: '鄂尔多斯市', label: '鄂尔多斯' },
    { value: '恩施市', label: '恩施' },
    { value: '鄂州市', label: '鄂州' },
  ],
  F: [
    { value: '福州市', label: '福州' },
    { value: '佛山市', label: '佛山' },
    { value: '抚顺市', label: '抚顺' },
    { value: '阜阳市', label: '阜阳' },
    { value: '抚州市', label: '抚州' },
  ],
  G: [
    { value: '广州市', label: '广州' },
    { value: '贵阳市', label: '贵阳' },
    { value: '桂林市', label: '桂林' },
    { value: '赣州市', label: '赣州' },
    { value: '广元市', label: '广元' },
  ],
  H: [
    { value: '杭州市', label: '杭州' },
    { value: '合肥市', label: '合肥' },
    { value: '哈尔滨市', label: '哈尔滨' },
    { value: '海口市', label: '海口' },
    { value: '呼和浩特市', label: '呼和浩特' },
    { value: '惠州市', label: '惠州' },
    { value: '湖州市', label: '湖州' },
    { value: '衡阳市', label: '衡阳' },
    { value: '邯郸市', label: '邯郸' },
  ],
  J: [
    { value: '济南市', label: '济南' },
    { value: '嘉兴市', label: '嘉兴' },
    { value: '金华市', label: '金华' },
    { value: '吉林市', label: '吉林' },
    { value: '江门市', label: '江门' },
    { value: '揭阳市', label: '揭阳' },
    { value: '锦州市', label: '锦州' },
    { value: '九江市', label: '九江' },
  ],
  K: [
    { value: '昆明市', label: '昆明' },
    { value: '开封市', label: '开封' },
  ],
  L: [
    { value: '兰州市', label: '兰州' },
    { value: '拉萨市', label: '拉萨' },
    { value: '洛阳市', label: '洛阳' },
    { value: '临沂市', label: '临沂' },
    { value: '柳州市', label: '柳州' },
    { value: '泸州市', label: '泸州' },
    { value: '连云港市', label: '连云港' },
  ],
  M: [
    { value: '绵阳市', label: '绵阳' },
    { value: '马鞍山市', label: '马鞍山' },
    { value: '牡丹江市', label: '牡丹江' },
  ],
  N: [
    { value: '南京市', label: '南京' },
    { value: '南昌市', label: '南昌' },
    { value: '南宁市', label: '南宁' },
    { value: '宁波市', label: '宁波' },
    { value: '南通市', label: '南通' },
    { value: '南阳市', label: '南阳' },
  ],
  P: [
    { value: '莆田市', label: '莆田' },
    { value: '盘锦市', label: '盘锦' },
    { value: '攀枝花市', label: '攀枝花' },
  ],
  Q: [
    { value: '青岛市', label: '青岛' },
    { value: '泉州市', label: '泉州' },
    { value: '秦皇岛市', label: '秦皇岛' },
    { value: '齐齐哈尔市', label: '齐齐哈尔' },
    { value: '曲靖市', label: '曲靖' },
  ],
  R: [{ value: '日照市', label: '日照' }],
  S: [
    { value: '上海市', label: '上海' },
    { value: '深圳市', label: '深圳' },
    { value: '苏州市', label: '苏州' },
    { value: '沈阳市', label: '沈阳' },
    { value: '石家庄市', label: '石家庄' },
    { value: '绍兴市', label: '绍兴' },
    { value: '汕头市', label: '汕头' },
    { value: '三亚市', label: '三亚' },
    { value: '商丘市', label: '商丘' },
  ],
  T: [
    { value: '天津市', label: '天津' },
    { value: '太原市', label: '太原' },
    { value: '台湾', label: '台湾省' },
    { value: '唐山市', label: '唐山' },
    { value: '泰州市', label: '泰州' },
    { value: '台州市', label: '台州' },
    { value: '泰安市', label: '泰安' },
  ],
  W: [
    { value: '武汉市', label: '武汉' },
    { value: '无锡市', label: '无锡' },
    { value: '温州市', label: '温州' },
    { value: '乌鲁木齐市', label: '乌鲁木齐' },
    { value: '威海市', label: '威海' },
    { value: '芜湖市', label: '芜湖' },
    { value: '梧州市', label: '梧州' },
  ],
  X: [
    { value: '西安市', label: '西安' },
    { value: '香港', label: '香港特别行政区' },
    { value: '厦门市', label: '厦门' },
    { value: '西宁市', label: '西宁' },
    { value: '徐州市', label: '徐州' },
    { value: '湘潭市', label: '湘潭' },
    { value: '咸阳市', label: '咸阳' },
    { value: '新乡市', label: '新乡' },
  ],
  Y: [
    { value: '烟台市', label: '烟台' },
    { value: '宜昌市', label: '宜昌' },
    { value: '银川市', label: '银川' },
    { value: '岳阳市', label: '岳阳' },
    { value: '扬州市', label: '扬州' },
    { value: '宜宾市', label: '宜宾' },
    { value: '盐城市', label: '盐城' },
  ],
  Z: [
    { value: '郑州市', label: '郑州' },
    { value: '珠海市', label: '珠海' },
    { value: '中山市', label: '中山' },
    { value: '淄博市', label: '淄博' },
    { value: '镇江市', label: '镇江' },
    { value: '湛江市', label: '湛江' },
    { value: '株洲市', label: '株洲' },
  ],
};

// 热门城市列表（单独使用）
export const popularCities: City[] = cityGroup['热门城市'];

// 字母索引列表（不包含热门城市）
export const indexList = Object.keys(cityGroup).filter((key) => key !== '热门城市');

export const shareActionSheet: ShareActionSheetData[] = [
  {
    label: '分享给朋友',
    children: [
      { img: '/assets/image/avatar5.png', label: 'Allen' },
      { img: '/assets/image/avatar.png', label: 'Nick' },
      { img: '/assets/image/avatar2.png', label: 'Jacky' },
      { img: '/assets/image/avatar3.png', label: 'Eric' },
      { img: '/assets/image/avatar4.png', label: 'Johnson' },
    ],
  },
  {
    label: '分享到社媒',
    children: [
      { img: '/assets/image/icon-wechat.png', label: 'WeChat' },
      { img: '/assets/image/icon-qq.png', label: 'QQ' },
      { img: '/assets/image/icon-doc.png', label: 'Doc' },
      { img: '/assets/image/icon-map.png', label: 'Map' },
      { img: '/assets/image/icon-qqmusic.png', label: 'QQ Music' },
    ],
  },
];

export default {};

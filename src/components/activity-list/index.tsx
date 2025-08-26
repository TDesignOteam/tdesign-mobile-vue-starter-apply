import './index.less';

import dayjs from 'dayjs';
import { isEmpty, isFunction } from 'lodash';
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import type { ActivityModel } from '@/api/model/listModel';
import { getEarlyDate } from '@/utils/activity/getDate';
import { getMaxPrice, getMinPrice } from '@/utils/activity/getPrice';

import Empty from '../result/Empty';

export default defineComponent({
  name: 'ActivityList',
  props: {
    data: {
      type: Array as PropType<ActivityModel[]>,
    },
    // Function(custom filter method)
    filterBy: {
      type: [Function] as PropType<any>,
    },
    // latest | max-evaluate
    sortBy: {
      type: [String] as PropType<any>,
    },
  },
  setup(props) {
    const sortedData = computed(() => {
      return props.data.sort((a, b) => {
        if (props.sortBy === 'latest') {
          return dayjs(getEarlyDate(a)).isBefore(getEarlyDate(b)) ? -1 : 1;
        }
        if (props.sortBy === 'max-evaluate') {
          return b.evaluate - a.evaluate;
        }
        return 0;
      });
    });

    const filteredData = computed(() => {
      return sortedData.value.filter((i) => {
        if (isFunction(props.filterBy)) {
          return props.filterBy(i);
        }
        return true;
      });
    });

    const emptyNode = computed(() => {
      return (
        <div class="t-empty">
          <Empty class="t-empty__img" />
          <span>{isEmpty(props.data) ? '暂无数据' : '当前筛选条件下没有数据～'}</span>
        </div>
      );
    });

    // 注入路由

    const router = (window as any).$vueRouter || useRouter();

    const handleItemClick = (id: string | number) => {
      router.push(`/activity/${id}`);
    };

    const renderList = () => {
      const getPrice = (item: ActivityModel) => {
        if (item.price === 'free') {
          return '免费活动';
        }
        return `¥${getMinPrice(item)}-¥${getMaxPrice(item)}`;
      };

      const list = filteredData.value.map((item) => {
        return (
          <div class="activity-list-item" onClick={() => handleItemClick(item.id)}>
            <div class="activity-list-item__image">
              <img src={item.img} alt={item.name} />
            </div>
            <div class="activity-list-item__content">
              <div class="activity-list-item__content-title">{item.name}</div>
              <div class="activity-list-item__content-evaluate">
                <t-rate value={item.evaluate} max="5" size="16" placement="" allow-half />
                <span class="evaluate-text">{item.evaluate}分</span>
              </div>
              <div class="activity-list-item__content-price">{getPrice(item)}</div>
            </div>
          </div>
        );
      });

      return list.length > 0 ? list : emptyNode.value;
    };

    return () => {
      return <>{renderList()}</>;
    };
  },
});

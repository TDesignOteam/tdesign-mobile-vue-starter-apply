import { fakerZH_CN as faker } from '@faker-js/faker'
import { factory, manyOf, primaryKey } from '@mswjs/data'
import { defaultFilterOptions } from '@/constant/filters'
import { generateDateRange } from '@/utils/date'
import { cnCommentPool, cnIntroducePool, covers } from './mockData'

const [sixMonthsAgo, sixMonthsLater] = generateDateRange()

function generatePrice() {
  const priceType = faker.helpers.arrayElement(['free', 'single', 'range'])

  if (priceType === 'free') {
    return { minPrice: 0, maxPrice: 0, priceType }
  }
  else if (priceType === 'single') {
    const singlePrice = faker.number.int({
      min: defaultFilterOptions.minPrice,
      max: defaultFilterOptions.maxPrice,
    })
    return { minPrice: singlePrice, maxPrice: singlePrice, priceType }
  }
  else {
    const min = faker.number.int({
      min: defaultFilterOptions.minPrice,
      max: defaultFilterOptions.maxPrice / 2,
    })
    const max = faker.number.int({
      min,
      max: defaultFilterOptions.maxPrice,
    })
    return { minPrice: min, maxPrice: max, priceType }
  }
}

// 生成票类场次数据
function generateTickets(activityId: string) {
  const ticketCount = faker.number.int({ min: 1, max: 5 })
  const tickets = []

  for (let i = 0; i < ticketCount; i++) {
    tickets.push({
      id: faker.string.uuid(),
      activityId,
      date: faker.date.between({
        from: new Date(),
        to: generateDateRange(0, 12)[1], // 未来12个月
      }).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    })
  }

  return tickets
}

// 生成票档价格数据
type PriceType = 'free' | 'single' | 'range'
function generatePrices(activityId: string, minPrice: number, maxPrice: number, priceType: PriceType) {
  // 定义每种 priceType 对应的生成策略
  const priceStrategies = {
    free: () => [
      {
        id: faker.string.uuid(),
        activityId,
        description: '免费活动',
        price: 0,
        originalPrice: 0,
        person: 1,
      },
    ],

    single: () => {
      const earlyBirdPrice = Math.max(0, minPrice - faker.number.int({ min: 5, max: 20 }))
      const duoEarlyBirdPrice = Math.max(0, minPrice * 2 - faker.number.int({ min: 10, max: 40 }))

      return [
        // 早鸟价-单人
        {
          id: faker.string.uuid(),
          activityId,
          description: '早鸟价-单人票',
          price: earlyBirdPrice,
          originalPrice: minPrice,
          person: 1,
        },
        // 正价-单人
        {
          id: faker.string.uuid(),
          activityId,
          description: '正价-单人票',
          price: minPrice,
          originalPrice: minPrice,
          person: 1,
        },
        // 早鸟价-双人
        {
          id: faker.string.uuid(),
          activityId,
          description: '早鸟价-双人票',
          price: duoEarlyBirdPrice,
          originalPrice: minPrice * 2,
          person: 2,
        },
        // 正价-双人
        {
          id: faker.string.uuid(),
          activityId,
          description: '正价-双人票',
          price: minPrice * 2,
          originalPrice: minPrice * 2,
          person: 2,
        },
      ]
    },

    range: () => {
      const earlyBirdMinPrice = Math.max(0, minPrice - faker.number.int({ min: 5, max: 20 }))
      const earlyBirdMaxPrice = Math.max(0, maxPrice - faker.number.int({ min: 5, max: 20 }))

      return [
        // 早鸟价-最低
        {
          id: faker.string.uuid(),
          activityId,
          description: '早鸟价-单人票',
          price: earlyBirdMinPrice,
          originalPrice: minPrice,
          person: 1,
        },
        // 正价-最低
        {
          id: faker.string.uuid(),
          activityId,
          description: '正价-单人票',
          price: minPrice,
          originalPrice: minPrice,
          person: 1,
        },
        // 早鸟价-最高
        {
          id: faker.string.uuid(),
          activityId,
          description: '早鸟价-单人票(高价)',
          price: earlyBirdMaxPrice,
          originalPrice: maxPrice,
          person: 1,
        },
        // 正价-最高
        {
          id: faker.string.uuid(),
          activityId,
          description: '正价-单人票(高价)',
          price: maxPrice,
          originalPrice: maxPrice,
          person: 1,
        },
      ]
    },
  }
  return priceStrategies[priceType]()
}

export const db = factory({
  activity: {
    id: primaryKey(faker.string.uuid), // 主键 ID
    title: () => `${faker.company.name()}活动`,
    cover: () => faker.helpers.arrayElement(covers),
    // 详情：横幅图
    banner: () => '/mock-imgs/activity/sicc2021.png',
    // 详情：嘉宾与现场轮播图
    guestImages: () => ['/mock-imgs/activity/guests1.png', '/mock-imgs/activity/guests2.png'],
    sceneImages: () => ['/mock-imgs/activity/location1.png', '/mock-imgs/activity/location2.png'],
    score: () => faker.number.float({ min: 0, max: 5, multipleOf: 0.5 }),
    minPrice: () =>
      faker.number.int({
        min: defaultFilterOptions.minPrice,
        max: defaultFilterOptions.maxPrice / 2,
      }),
    maxPrice: () =>
      faker.number.int({
        min: defaultFilterOptions.maxPrice / 2,
        max: defaultFilterOptions.maxPrice,
      }),
    domain: () => faker.helpers.arrayElement(defaultFilterOptions.domain),
    type: () => faker.helpers.arrayElement(defaultFilterOptions.type),
    date: () => faker.date.between({ from: sixMonthsAgo, to: sixMonthsLater }), // 过去半年到未来半年
    address: () => faker.location.streetAddress(),
    introduce: () => faker.helpers.arrayElement(cnIntroducePool),
    // 详情：感兴趣人数（用于头像组右侧的人数展示）
    interestedCount: () => faker.number.int({ min: 50, max: 5000 }),
    comments: manyOf('comment'), // 嵌套评论
    interestedPeople: manyOf('interestedPerson'), // 嵌套感兴趣的人

  },
  // 独立的评论模型
  comment: {
    id: primaryKey(faker.string.uuid),
    user: () => faker.person.fullName(),
    avatar: () => faker.image.avatar(),
    rating: () => faker.number.int({ min: 1, max: 5 }),
    content: () => faker.helpers.arrayElement(cnCommentPool),
  },

  // 独立的感兴趣的人模型
  interestedPerson: {
    id: primaryKey(faker.string.uuid),
    name: () => faker.person.fullName(),
    avatar: () => faker.image.avatar(),
  },

  personActivity: {
    id: primaryKey(faker.string.uuid), // 主键 ID
    personId: () => faker.string.uuid(), // 个人 ID
    title: () => `${faker.company.name()}活动`, // 活动标题
    status: () => faker.helpers.arrayElement(['已完成', '待参加']),
    date: () => faker.date.between({ from: sixMonthsAgo, to: sixMonthsLater }), // 过去半年到未来半年
    cover: () => faker.helpers.arrayElement(covers),
  },

  friendList: {
    id: primaryKey(faker.string.uuid),
    name: () => faker.person.fullName(),
    avatar: () => faker.image.avatar(),
  },

  ticket: {
    id: primaryKey(faker.string.uuid),
    activityId: String,
    date: String,
  },

  price: {
    id: primaryKey(faker.string.uuid),
    activityId: String,
    description: String,
    price: Number,
    originalPrice: Number,
    person: Number,
  },

  shareAppIconList: {
    id: primaryKey(String),
    name: String,
    icon: String,
  },
  // 用户档案
  userProfile: {
    id: primaryKey(String),
    name: String,
    age: Number,
    occupation: String,
    avatar: String,
    city: String,
  },
})

const comments = Array.from({ length: 66 })
  .fill(null)
  .map(() => db.comment.create())
const interestedPeople = Array.from({ length: 66 })
  .fill(null)
  .map(() => db.interestedPerson.create())

Array.from({ length: 5 })
  .fill(null)
  .map(() => db.friendList.create())

// 预生成一些假数据
for (let i = 0; i < 100; i++) {
  const priceInfo = generatePrice()
  const activity = db.activity.create({ ...priceInfo, comments, interestedPeople })

  // 为每个活动生成票类场次数据
  const activityTickets = generateTickets(activity.id)
  activityTickets.forEach((ticket) => {
    db.ticket.create(ticket)
  })

  // 为每个活动生成票档价格数据
  const activityPrices = generatePrices(activity.id, activity.minPrice, activity.maxPrice, priceInfo.priceType)
  activityPrices.forEach((price) => {
    db.price.create(price)
  })
}

for (let i = 0; i < 20; i++) {
  db.personActivity.create()
}

// 预置一个用户档案
db.userProfile.create({
  id: 'current',
  name: faker.person.fullName(),
  age: faker.number.int({ min: 18, max: 60 }),
  occupation: faker.person.jobTitle(),
  avatar: faker.image.avatar(),
  city: faker.location.city(),
})

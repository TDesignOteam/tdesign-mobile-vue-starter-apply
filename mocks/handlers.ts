import type { ActivityFilterParams, SortOption } from '@/api/activity'
import { delay, http, HttpResponse } from 'msw'
import { compareDates, isDateInRange } from '@/utils/date'
import { db } from './db'
import { appList, swiperList } from './mockData'

interface ActivitiesRequestBody {
  params: ActivityFilterParams & {
    page?: number
    pageSize?: number
    sort?: SortOption
  }
}

export const handlers = [
  http.get('/api/homeSwiper', async () => {
    await delay(200)
    return HttpResponse.json(
      {
        data: swiperList,
      },
      { status: 200 },
    )
  }),
  http.post('/api/activities', async ({ request }) => {
    await delay(500)
    const data = await request.json()
    const { params } = data as ActivitiesRequestBody
    const {
      domain = [],
      type = [],
      minPrice,
      maxPrice,
      dateRange = [],
      sort = 'latest',
      page = 1,
      pageSize = 10,
    } = params

    let filteredResult = db.activity.getAll()

    if (domain.length > 0) {
      filteredResult = filteredResult.filter(activity =>
        domain.some((field: string) => activity.domain.includes(field)),
      )
    }

    if (type.length > 0) {
      filteredResult = filteredResult.filter(activity =>
        type.includes(activity.type),
      )
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      filteredResult = filteredResult.filter((activity) => {
        return activity.minPrice <= maxPrice && activity.maxPrice >= minPrice
      })
    }

    if (dateRange.length === 2) {
      filteredResult = filteredResult.filter((activity) => {
        return isDateInRange(activity.date, dateRange[0], dateRange[1])
      })
    }

    if (sort === 'top') {
      filteredResult.sort((a, b) => b.score - a.score)
    }
    else if (sort === 'latest') {
      filteredResult.sort((a, b) => compareDates(a.date, b.date, 'desc'))
    }

    const total = filteredResult.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filteredResult.slice(start, end)

    return HttpResponse.json(
      {
        data: { paginatedData, total },
      },
      {
        status: 200,
      },
    )
  }),

  http.get('/api/personActivities', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const personIdParam = url.searchParams.get('personId')
    const statusParam = url.searchParams.get('status')

    let all = db.personActivity.getAll()

    // Filter by personId
    if (personIdParam) {
      all = all.filter(item => item.personId === personIdParam)
    }

    // Filter by status
    if (statusParam) {
      all = all.filter(item => item.status === statusParam)
    }

    const total = all.length

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const pageData = all.slice(start, end)

    return HttpResponse.json({
      data: pageData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  }),

  http.get('/api/activities/:id', ({ params }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    if (!id) {
      return new HttpResponse(null, { status: 400 })
    }

    const activity = db.activity.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    })

    if (!activity) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(activity)
  }),

  http.get('/api/activities/:id/tickets', ({ params }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    if (!id) {
      return new HttpResponse(null, { status: 400 })
    }

    const tickets = db.ticket.findMany({
      where: {
        activityId: {
          equals: id,
        },
      },
    })

    return HttpResponse.json(tickets)
  }),

  http.get('/api/activities/:id/prices', ({ params }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    if (!id) {
      return new HttpResponse(null, { status: 400 })
    }

    const prices = db.price.findMany({
      where: {
        activityId: {
          equals: id,
        },
      },
    })
    return HttpResponse.json(prices)
  }),

  http.get('/api/share/friends', () => {
    const friendList = db.friendList.getAll()
    return HttpResponse.json(friendList)
  }),

  http.get('/api/share/app', () => {
    return HttpResponse.json(appList)
  }),

  // 用户信息
  http.get('/api/user/profile', () => {
    const profile = db.userProfile.findFirst({
      where: { id: { equals: 'current' } },
    })
    return HttpResponse.json(profile)
  }),
  // 处理Vue开发服务器的样式请求
  http.get(/\.vue\?vue&type=style/, () => {
    return new HttpResponse(null, { status: 200 })
  }),
]

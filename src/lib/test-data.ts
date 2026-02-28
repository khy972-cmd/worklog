import { Site, Worklog } from '../types';

export const TEST_SITES: Site[] = [
  { 
    id: 'site1', 
    name: '자이 아파트 101동 신축공사', 
    dept: '대구지사', 
    contractor: '현대건설', 
    status: 'ing', 
    address: '대구광역시 동구 동부로 149', 
    pinned: true 
  },
  { 
    id: 'site2', 
    name: '삼성 반도체 P3 배관설치', 
    dept: '평택지사', 
    contractor: '삼성물산', 
    status: 'done', 
    address: '경기도 평택시 고덕면 1' 
  },
  { 
    id: 'site3', 
    name: '현대 오피스텔 리모델링', 
    dept: '본사', 
    contractor: '현대건설', 
    status: 'ing' 
  },
  { 
    id: 'site4', 
    name: '롯데캐슬 골드파크 내벽수리', 
    dept: '부산지사', 
    contractor: '롯데건설', 
    status: 'ing' 
  },
  { 
    id: 'site5', 
    name: 'SK Hynix M15 클리닝', 
    dept: '경기지사', 
    contractor: 'SK건설', 
    status: 'pending' 
  }
];

export const TEST_WORKLOGS: Worklog[] = [
  {
    id: 'log1',
    siteId: 'site1',
    date: '2024-02-26',
    status: 'draft',
    manpower: [
      { id: 'm1', name: '이현수', hours: 2.0, isCustom: false },
      { id: 'm2', name: '김철수', hours: 1.5, isCustom: false },
      { id: 'm3', name: '박영희', hours: 2.5, isCustom: false }
    ],
    workSets: [
      {
        id: 'ws1',
        member: '슬라브',
        process: '균열',
        type: '지상',
        location: { block: 'A블록', dong: '101동', floor: '15층' }
      },
      {
        id: 'ws2',
        member: '기둥',
        process: '마감',
        type: '지상',
        location: { block: 'A블록', dong: '101동', floor: '15층' }
      }
    ],
    materials: [
      { id: 'mat1', name: 'NPC-1000', quantity: 2.5, unit: '말' },
      { id: 'mat2', name: 'NPC-3000Q', quantity: 1.0, unit: '말' }
    ],
    photos: [
      {
        id: 'p1',
        url: 'https://picsum.photos/seed/work1-before/300/300.jpg',
        status: 'before',
        timestamp: '2024-02-26T09:00:00Z'
      },
      {
        id: 'p2',
        url: 'https://picsum.photos/seed/work1-after/300/300.jpg',
        status: 'after',
        timestamp: '2024-02-26T15:00:00Z'
      }
    ],
    drawings: [
      {
        id: 'd1',
        url: 'https://picsum.photos/seed/drawing1/300/300.jpg',
        status: 'progress',
        timestamp: '2024-02-26T10:00:00Z'
      }
    ],
    createdAt: '2024-02-26T08:00:00Z',
    updatedAt: '2024-02-26T16:00:00Z',
    version: 1
  },
  {
    id: 'log2',
    siteId: 'site1',
    date: '2024-02-27',
    status: 'pending',
    manpower: [
      { id: 'm4', name: '정민수', hours: 3.0, isCustom: false },
      { id: 'm5', name: '최지영', hours: 2.0, isCustom: false }
    ],
    workSets: [
      {
        id: 'ws3',
        member: '거더',
        process: '면',
        type: '지하',
        location: { block: 'B블록', dong: '102동', floor: 'B1층' }
      }
    ],
    materials: [
      { id: 'mat3', name: 'NPC-2000', quantity: 3.0, unit: '말' }
    ],
    photos: [
      {
        id: 'p3',
        url: 'https://picsum.photos/seed/work2-before/300/300.jpg',
        status: 'before',
        timestamp: '2024-02-27T09:00:00Z'
      },
      {
        id: 'p4',
        url: 'https://picsum.photos/seed/work2-after/300/300.jpg',
        status: 'after',
        timestamp: '2024-02-27T17:00:00Z'
      }
    ],
    drawings: [],
    createdAt: '2024-02-27T08:00:00Z',
    updatedAt: '2024-02-27T17:00:00Z',
    version: 1
  },
  {
    id: 'log3',
    siteId: 'site2',
    date: '2024-02-26',
    status: 'approved',
    manpower: [
      { id: 'm6', name: '이현수', hours: 4.0, isCustom: false },
      { id: 'm7', name: '김철수', hours: 3.5, isCustom: false }
    ],
    workSets: [
      {
        id: 'ws4',
        member: '기둥',
        process: '균열',
        type: '지상',
        location: { block: 'C블록', dong: '201동', floor: '3층' }
      }
    ],
    materials: [
      { id: 'mat4', name: 'NPC-1000', quantity: 4.0, unit: '말' },
      { id: 'mat5', name: 'NPC-5000', quantity: 1.5, unit: '말' }
    ],
    photos: [
      {
        id: 'p5',
        url: 'https://picsum.photos/seed/work3-before/300/300.jpg',
        status: 'before',
        timestamp: '2024-02-26T08:00:00Z'
      },
      {
        id: 'p6',
        url: 'https://picsum.photos/seed/work3-after/300/300.jpg',
        status: 'after',
        timestamp: '2024-02-26T18:00:00Z'
      }
    ],
    drawings: [
      {
        id: 'd2',
        url: 'https://picsum.photos/seed/drawing2/300/300.jpg',
        status: 'complete',
        timestamp: '2024-02-26T12:00:00Z'
      }
    ],
    createdAt: '2024-02-26T07:00:00Z',
    updatedAt: '2024-02-26T18:00:00Z',
    version: 2
  },
  {
    id: 'log4',
    siteId: 'site3',
    date: '2024-02-25',
    status: 'reject',
    rejectReason: '사진 품질이 불량합니다. 보수 전후 사진을 명확하게 촬영해주세요.',
    manpower: [
      { id: 'm8', name: '박영희', hours: 2.0, isCustom: false }
    ],
    workSets: [
      {
        id: 'ws5',
        member: '슬라브',
        process: '마감',
        type: '지붕',
        location: { block: 'D블록', dong: '301동', floor: '옥상' }
      }
    ],
    materials: [
      { id: 'mat6', name: 'NPC-3000Q', quantity: 1.0, unit: '말' }
    ],
    photos: [
      {
        id: 'p7',
        url: 'https://picsum.photos/seed/work4-blurry/300/300.jpg',
        status: 'before',
        timestamp: '2024-02-25T10:00:00Z'
      }
    ],
    drawings: [],
    createdAt: '2024-02-25T09:00:00Z',
    updatedAt: '2024-02-25T16:00:00Z',
    version: 1
  },
  {
    id: 'log5',
    siteId: 'site4',
    date: '2024-02-27',
    status: 'draft',
    manpower: [
      { id: 'm9', name: '정민수', hours: 1.5, isCustom: false },
      { id: 'm10', name: '최지영', hours: 2.5, isCustom: false },
      { id: 'm11', name: '이현수', hours: 3.0, isCustom: false }
    ],
    workSets: [
      {
        id: 'ws6',
        member: '거더',
        process: '균열',
        type: '지상',
        location: { block: 'E블록', dong: '401동', floor: '8층' }
      },
      {
        id: 'ws7',
        member: '기둥',
        process: '면',
        type: '지상',
        location: { block: 'E블록', dong: '401동', floor: '8층' }
      }
    ],
    materials: [
      { id: 'mat7', name: 'NPC-1000', quantity: 2.0, unit: '말' },
      { id: 'mat8', name: 'NPC-2000', quantity: 1.5, unit: '말' },
      { id: 'mat9', name: 'NPC-4000', quantity: 0.5, unit: '말' }
    ],
    photos: [
      {
        id: 'p8',
        url: 'https://picsum.photos/seed/work5-before/300/300.jpg',
        status: 'before',
        timestamp: '2024-02-27T09:00:00Z'
      }
    ],
    drawings: [
      {
        id: 'd3',
        url: 'https://picsum.photos/seed/drawing3/300/300.jpg',
        status: 'progress',
        timestamp: '2024-02-27T11:00:00Z'
      }
    ],
    createdAt: '2024-02-27T08:00:00Z',
    updatedAt: '2024-02-27T14:00:00Z',
    version: 1
  }
];

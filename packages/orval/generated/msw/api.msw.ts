/**
 * Generated by orval v7.11.1 🍺
 * Do not edit manually.
 * 猫API
 * PoC of TypeSpec document
 * OpenAPI spec version: 1.0.0
 */
import {
  faker
} from '@faker-js/faker';

import {
  HttpResponse,
  delay,
  http
} from 'msw';

import type {
  CatsAddCatInfo200
} from './api.schemas';


export const getCatsAddCatInfoResponseMock = (overrideResponse: Partial< CatsAddCatInfo200 > = {}): CatsAddCatInfo200 => ({message: faker.helpers.arrayElement(['登録成功'] as const), ...overrideResponse})


export const getCatsAddCatInfoMockHandler = (overrideResponse?: CatsAddCatInfo200 | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CatsAddCatInfo200> | CatsAddCatInfo200)) => {
  return http.post('*/cats/new', async (info) => {await delay(1000);
  
    return new HttpResponse(JSON.stringify(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCatsAddCatInfoResponseMock()),
      { status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
  })
}
export const getApiMock = () => [
  getCatsAddCatInfoMockHandler()]

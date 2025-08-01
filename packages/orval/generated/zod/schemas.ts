/**
 * Generated by orval v7.11.1 🍺
 * Do not edit manually.
 * 猫API
 * PoC of TypeSpec document
 * OpenAPI spec version: 1.0.0
 */
import {
  z as zod
} from 'zod';

/**
 * 猫情報をデータベースに登録し、登録結果を返します
 * @summary 猫情報をAPIに登録する
 */
export const catsAddCatInfoBodyAgeMaxOne = 40;


export const catsAddCatInfoBody = zod.object({
  "name": zod.string().describe('お名前'),
  "type": zod.enum(['ミックス', 'スコティッシュフォールド', 'マンチカン']).describe('猫種'),
  "age": zod.number().min(1).max(catsAddCatInfoBodyAgeMaxOne).describe('年齢').describe('年齢')
})

export const catsAddCatInfoResponse = zod.object({
  "message": zod.enum(['登録成功'])
})

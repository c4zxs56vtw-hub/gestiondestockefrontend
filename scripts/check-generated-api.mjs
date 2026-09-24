#!/usr/bin/env node
import { existsSync } from 'fs'
import { resolve } from 'path'

const generatedPath = resolve('src/shared/infrastructure/api/generated/openapi.ts')
const openapiPath = resolve('docs/openapi.yaml')

if (!existsSync(generatedPath)) {
  console.error('ERROR: Generated file not found:', generatedPath)
  console.error('Run: npm run api:generate')
  process.exit(1)
}
if (!existsSync(openapiPath)) {
  console.error('ERROR: OpenAPI spec not found:', openapiPath)
  process.exit(1)
}
console.log('OK: Generated types file exists at', generatedPath)

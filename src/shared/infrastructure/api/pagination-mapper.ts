import type { Page } from '@/shared/domain/models'
import type { PageDto } from './pagination-dto'

export function mapPage<Dto, Domain>(dto: PageDto<Dto>, mapItem: (item: Dto) => Domain): Page<Domain> {
  return { content: dto.content.map(mapItem), page: dto.page, size: dto.size,
    totalElements: dto.totalElements, totalPages: dto.totalPages }
}

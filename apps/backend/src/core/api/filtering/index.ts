import { Injectable } from '@nestjs/common';
import type { FilteringParams, FilteringInput, FilterCondition, FilterGroup, FilterOperator } from '../types';
import type { IFilteringService } from '../interfaces';
import { ApiInvalidFilterException } from '../exceptions';

@Injectable()
export class FilteringService implements IFilteringService {
  parse(input: FilteringInput): FilteringParams {
    if (!input.filter) {
      return { filter: [] };
    }

    try {
      const parsed = JSON.parse(input.filter);

      if (Array.isArray(parsed)) {
        return { filter: parsed as FilterGroup[] };
      }

      if (parsed.logic && parsed.conditions) {
        return { filter: [parsed as FilterGroup] };
      }

      return { filter: [] };
    } catch {
      throw new ApiInvalidFilterException(
        'Invalid filter format. Expected JSON array of filter groups.',
        { filter: input.filter },
      );
    }
  }

  validate(params: FilteringParams, allowedFields: string[]): void {
    const maxConditions = 20;
    let totalConditions = 0;

    for (const group of params.filter) {
      for (const condition of group.conditions) {
        totalConditions++;

        if (!allowedFields.includes(condition.field)) {
          throw new ApiInvalidFilterException(
            `Filter field "${condition.field}" is not allowed`,
            { field: condition.field, allowedFields },
          );
        }

        if (!this.isValidOperator(condition.operator)) {
          throw new ApiInvalidFilterException(
            `Filter operator "${condition.operator}" is not valid`,
            { operator: condition.operator },
          );
        }
      }
    }

    if (totalConditions > maxConditions) {
      throw new ApiInvalidFilterException(
        `Maximum of ${maxConditions} filter conditions allowed`,
        { totalConditions, maxConditions },
      );
    }
  }

  buildQuery(params: FilteringParams): Record<string, unknown> {
    const query: Record<string, unknown> = {};

    for (const group of params.filter) {
      for (const condition of group.conditions) {
        query[`filter[${condition.field}]`] = {
          operator: condition.operator,
          value: condition.value,
        };
      }
    }

    return query;
  }

  addCondition(group: FilterGroup, condition: FilterCondition): FilterGroup {
    return {
      ...group,
      conditions: [...group.conditions, condition],
    };
  }

  createGroup(logic: 'AND' | 'OR', conditions?: FilterCondition[]): FilterGroup {
    return { logic, conditions: conditions ?? [] };
  }

  private isValidOperator(operator: string): operator is FilterOperator {
    const validOperators: FilterOperator[] = [
      'eq', 'neq', 'contains', 'not_contains',
      'starts_with', 'ends_with', 'gt', 'gte', 'lt', 'lte',
      'in', 'not_in', 'between', 'date_between',
      'is_null', 'is_not_null',
    ];
    return validOperators.includes(operator as FilterOperator);
  }
}

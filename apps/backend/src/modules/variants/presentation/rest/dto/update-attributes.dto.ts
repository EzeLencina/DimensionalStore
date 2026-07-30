import { IsArray, ValidateNested, IsString, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class AttributeItemDto {
  @IsString() name!: string;
  @IsString() value!: string;
}

export class UpdateAttributesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttributeItemDto)
  attributes!: { name: string; value: string }[];
}

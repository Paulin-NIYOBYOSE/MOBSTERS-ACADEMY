import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AssignRolesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  roles: string[];
}
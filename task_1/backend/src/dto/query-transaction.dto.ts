import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class QueryTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: 'startTime must be in HH:MM:SS format',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: 'endTime must be in HH:MM:SS format',
  })
  endTime: string;
}

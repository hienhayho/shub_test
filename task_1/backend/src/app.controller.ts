import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { extname } from 'path';

@Controller()
export class AppController {
  constructor(private readonly transactionsService: AppService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
          return cb(
            new BadRequestException('Only .xlsx files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required!');
    }
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
    };
  }

  @Get('query')
  async queryTransactions(@Query() query: QueryTransactionDto) {
    const startTime = query.startTime;
    const endTime = query.endTime;
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    if (start >= end) {
      throw new BadRequestException('startTime must be before endTime');
    }
    return this.transactionsService.getTransactionsWithinTimeRange(query);
  }
}

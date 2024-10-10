import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@Injectable()
export class AppService {
  private readonly uploadDir = './uploads';

  async getTransactionsWithinTimeRange(query: QueryTransactionDto) {
    const { startTime, endTime } = query;

    const files = fs.readdirSync(this.uploadDir);
    if (files.length === 0) {
      throw new BadRequestException('No file uploaded yet.');
    }

    const latestFile = files[files.length - 1];
    const filePath = path.join(this.uploadDir, latestFile);

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    // console.log(data[10]);

    const filteredTransactions = data.filter((transaction: any) => {
      const transactionTime = new Date(
        `1970-01-01T${transaction['__EMPTY_1']}`,
      );
      const start = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);
      return transactionTime >= start && transactionTime <= end;
    });

    if (filteredTransactions.length === 0) {
      return {
        message: 'No transactions found in the given time range.',
        totalAmount: 0,
      };
    }

    const totalAmount = filteredTransactions.reduce((sum, transaction: any) => {
      return sum + transaction['__EMPTY_7'];
    }, 0);

    return { totalAmount, message: 'Transactions found' };
  }
}

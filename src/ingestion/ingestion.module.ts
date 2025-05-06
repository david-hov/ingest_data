import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IngestedSchema } from './schemas/ingestion.schema';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'ingested', schema: IngestedSchema }]),
    ],
    controllers: [IngestionController],
    providers: [IngestionService],
})

export class IngestionModule { }

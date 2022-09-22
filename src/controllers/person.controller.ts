import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonModel } from 'src/models/person.model';
import { PersonSchema } from 'src/schemas/person.schema';
import { Repository } from 'typeorm';

@Controller('/person')
export class PersonController {
  constructor(
    @InjectRepository(PersonModel) private model: Repository<PersonModel>,
  ) {}
  @Post()
  public async create(
    @Body() body: PersonSchema,
  ): Promise<{ data: PersonModel }> {
    const createPerson = await this.model.save(body);

    return { data: createPerson };
  }

  @Get(':id')
  public async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: PersonModel }> {
    const findOnePerson = await this.model.findOne({ where: { id } });
    if (!findOnePerson) throw new NotFoundException('404');
    return { data: findOnePerson };
  }

  @Get()
  public async getAll(): Promise<{ data: PersonModel[] }> {
    const listAll = await this.model.find();
    return { data: listAll };
  }

  @Put(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PersonSchema,
  ): Promise<{ data: PersonModel }> {
    const findOnePerson = await this.model.findOne({ where: { id } });
    if (!findOnePerson) throw new NotFoundException('404');
    await this.model.update({ id }, body);
    return { data: findOnePerson };
  }

  @Delete(':id')
  public async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: PersonModel }> {
    const findOnePerson = await this.model.findOne({ where: { id } });
    if (!findOnePerson) throw new NotFoundException('404');

    await this.model.delete({ id });
    return { data: findOnePerson };
  }
}

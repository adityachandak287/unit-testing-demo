import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PaymentDTO } from './dto/payment.dto';
import { CreateUserDTO, UpdateUserDTO, UserIdParamDTO } from './dto/user.dto';
import { PaymentService } from './payment.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('/hello')
  getHello() {
    return this.appService.getHello();
  }

  @Get()
  async getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Get('/:id')
  async getUserById(@Param() findUserPayload: UserIdParamDTO) {
    return this.appService.findUserById(Number(findUserPayload.id));
  }

  @Post()
  async createUser(@Body() createUserPayload: CreateUserDTO) {
    return this.appService.createUser({
      name: createUserPayload.name,
      email: createUserPayload.email,
    });
  }

  @Patch('/:id')
  async updateUser(
    @Param() user: UserIdParamDTO,
    @Body() updateUserPayload: UpdateUserDTO,
  ) {
    return this.appService.updateUser(Number(user.id), {
      name: updateUserPayload.name,
      email: updateUserPayload.email,
    });
  }

  @Delete('/:id')
  async deleteUser(@Param() deleteUserPayload: UserIdParamDTO) {
    return this.appService.deleteUser(Number(deleteUserPayload.id));
  }

  @Post('/pay')
  async getExchangeRate(@Body() paymentRequest: PaymentDTO) {
    return this.paymentService.verifyPayment(paymentRequest);
  }
}

import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { ItemsService } from './items.service';
import { ItemInput } from './input-items.input';
import { ItemType } from './dto/create-item.dto';
// import { AuthGuard } from '@nestjs/passport';
import { GqlAuthGuard } from '../auth/gqlauth.guard';
import { User } from '../users/user.decorator';
import { GetUserGroups } from '../users/user.helper';
// import { Subscription } from 'type-graphql';

const pubSub = new PubSub();

@Resolver()
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => [ItemType])
  @UseGuards(new GqlAuthGuard('jwt'))
  async items(@User() user: any) {
    // TODO: refactor as this groups filter will be used a lot
    //get groups from access token - only those groups will be returned
    let groups: string[] = GetUserGroups(user);

    // TODO: get board ID and add filter to find all query
    return this.itemsService.findAll(groups);
  }

  @Query(() => ItemType)
  @UseGuards(new GqlAuthGuard('jwt'))
  async itemById(@User() user: any, @Args('id') id: string) {
    let groups: string[] = GetUserGroups(user);

    return this.itemsService.findOne(id, groups);
  }

  @Mutation(() => ItemType)
  @UseGuards(new GqlAuthGuard('jwt'))
  async createItem(@Args('input') input: ItemInput) {
    //TODO: check user has access to the specified group
    const createdItem = await this.itemsService.create(input);
    pubSub.publish('itemCreatedOrUpdated', {
      itemCreatedOrUpdated: createdItem,
    });
    return createdItem;

    // return this.itemsService.create(input);
  }

  @Mutation(() => ItemType)
  @UseGuards(new GqlAuthGuard('jwt'))
  async updateItem(@Args('id') id: string, @Args('input') input: ItemInput) {
    //TODO: check user has access to group of this item
    const updatedItem = await this.itemsService.update(id, input);
    pubSub.publish('itemCreatedOrUpdated', {
      itemCreatedOrUpdated: updatedItem,
    });
    return updatedItem;
  }

  @Mutation(() => ItemType)
  @UseGuards(new GqlAuthGuard('jwt'))
  async deleteItem(@Args('id') id: string) {
    //TODO: check user has access to group of this item
    const deletedItem = await this.itemsService.delete(id);
    pubSub.publish('itemDeleted', { itemDeleted: deletedItem });
    return deletedItem;
  }

  @Subscription(returns => ItemType)
  @UseGuards(new GqlAuthGuard('jwt'))
  //TODO: check user has access to group of this item
  itemCreatedOrUpdated(@Args('token') token: string) {
    return pubSub.asyncIterator('itemCreatedOrUpdated');
  }

  @Subscription(returns => ItemType)
  @UseGuards(new GqlAuthGuard('jwt'))
  itemDeleted(@Args('token') token: string) {
    //TODO: check user has access to group of this item

    return pubSub.asyncIterator('itemDeleted');
  }
}

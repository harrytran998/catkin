import { InputType, Field } from 'type-graphql';

@InputType()
export class GroupInput {
  @Field()
  readonly name: string;
  @Field({ nullable: true })
  readonly role?: string;
  @Field({ nullable: true })
  readonly likes?: string;
  @Field({ nullable: true })
  readonly pains?: string;
  @Field({ nullable: true })
  readonly goal?: string;
}

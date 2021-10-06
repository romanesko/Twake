import { Column, Entity } from "../../../core/platform/services/database/services/orm/decorators";
import { CounterEntity } from "../../../utils/counters";

export const TYPE = "channel_counters";

@Entity(TYPE, {
  primaryKey: [["company_id", "workspace_id"], "id", "counter_type"],
  type: TYPE,
})
export class ChannelCounterEntity extends CounterEntity {
  @Column("company_id", "timeuuid")
  company_id: string;

  @Column("workspace_id", "timeuuid")
  workspace_id: string;

  @Column("id", "timeuuid")
  id: string;

  @Column("counter_type", "string")
  counter_type: "members" | "guests" | "messages";
}

export type ChannelCounterPrimaryKey = Pick<
  ChannelCounterEntity,
  "company_id" | "workspace_id" | "id" | "counter_type"
>;

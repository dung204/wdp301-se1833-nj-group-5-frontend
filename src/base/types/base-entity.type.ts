export interface BaseEntity {
  id: string;
  createTimestamp: string;
  deleteTimestamp?: string | null;
}

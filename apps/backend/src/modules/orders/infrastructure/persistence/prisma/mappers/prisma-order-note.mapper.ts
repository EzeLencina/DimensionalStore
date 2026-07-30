import { OrderNote } from '../../../../domain';

export class PrismaOrderNoteMapper {
  static toDomain(raw: any): OrderNote {
    return OrderNote.fromPrimitives({
      id: raw.id,
      tenantId: raw.tenantId,
      orderId: raw.orderId,
      content: raw.content,
      visibility: raw.visibility,
      createdBy: raw.createdBy,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPrisma(note: OrderNote): any {
    const p = note.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      orderId: p.orderId,
      content: p.content,
      visibility: p.visibility,
      createdBy: p.createdBy,
    };
  }
}

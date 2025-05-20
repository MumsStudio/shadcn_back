export class CreateDocumentDto {
  name: string;
  type: string;
  parentId?: string;
  ownerEmail: string;
}
export type TreatmentUpdateAttachment = {
  id: string;
  fileName: string;
  href?: string;
};

export type TreatmentUpdate = {
  id: string;
  authorName: string;
  createdAt: string;
  body: string;
  attachments?: TreatmentUpdateAttachment[];
};

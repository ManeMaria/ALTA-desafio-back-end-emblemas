import { File } from '@/core/domain';

export type UploadParams = {
  file: File;
  folder: string;
};

export type UpdateFileParams = {
  newFile: File;
  previousFileURL?: string;
  folder: string;
};

export type UrlParam = {
  url: string;
};

export interface IUploadService {
  upload(params: UploadParams): Promise<string>;
  delete(param: UrlParam): Promise<void>;
  update(params: UpdateFileParams): Promise<string>;
}

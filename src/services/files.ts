import { getUrl, uploadData, remove } from "aws-amplify/storage";

export const uploadFile = async (file: File, path: string): Promise<string> => {
  await uploadData({
    key: path,
    data: file,
    options: {
      accessLevel: "guest",
    },
  });

  return path;
};

export const getFileUrl = async (key: string): Promise<string> => {
  const response = await getUrl({ key });
  return response.url.toString();
};

export const deleteFile = async (key: string): Promise<void> => {
  await remove({
    key,
    options: {
      accessLevel: "guest",
    },
  });
};

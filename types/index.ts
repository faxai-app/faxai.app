// types/index.ts
export interface Author {
  id: number;
  name: string | null;
  profilePicture: string | null;
  niveau: number | null;
  filiere: string | null;
}

export interface Attachment {
  id: number;
  fileName: string;
  fileType: string | null;
  fileSize: number | null;
  isImage: boolean;
}

export interface Post {
  id: number;
  content: string | null;
  type: "post" | "epreuve" | "cours";
  createdAt: string;
  author: Author;
  level: {
    niveau: number | null;
    filiere: string | null;
    specialisation: string | null;
    annee: number | null;
  };
  hasMedia: boolean;
  images: {
    id: number;
    url: string;
    thumbnail?: string;
  }[];
  pdfCount: number;
  attachmentsMetadata: Attachment[];
  // Interaction states (optimistic UI)
  isLiked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  isBookmarked?: boolean;
}

export interface Comment {
  id: number;
  userId: number;
  userName: string;
  userProfilePic?: string;
  content: string;
  createdAt: string;
}

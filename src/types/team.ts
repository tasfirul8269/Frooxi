export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
  [key: string]: string | undefined;
}

export interface TeamMember {
  _id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  socialLinks: SocialLinks;
  isActive: boolean;
  order?: number;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
}

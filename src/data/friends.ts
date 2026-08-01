export interface Friend {
  name: string;
  url: string;
  description: string;
  avatar?: string;
}

export const friends: Friend[] = [
  // Add friends here. Avatar paths can point to files under public/friends/.
];

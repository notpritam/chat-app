import { mesaageType } from "@/routes/ChatPage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  token: string | null;
  user: UserType | null;
  isAnonymous: boolean;
  globalChats: mesaageType[];
  storeGlobalChats: (chat: mesaageType) => void;
  logOut: () => void;
  storeAnonymousUser: (user: UserType) => void;
  storeUser: (user: UserType, token: string) => void;
}

type UserType = {
  username: string;
  name: string;
  image: string;
  _id: string;
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAnonymous: true,
      globalChats: [],
      logOut: () => {
        set((state) => {
          return {
            ...state,
            user: null,
            isAnonymous: false,
            token: null,
          };
        });
      },
      storeGlobalChats: (chat: mesaageType) => {
        set((state) => {
          return {
            ...state,
            globalChats: [...state.globalChats, chat],
          };
        });
      },
      storeAnonymousUser: (user: UserType) => {
        set((state: UserState) => {
          return {
            ...state,
            user: {
              _id: user._id,
              username: user.username,
              image: user.image,
              name: user.name,
            },
            token: null, // Change the type of token from null to string | undefined
            isAnonymous: true,
          };
        });
      },
      storeUser: (user, token) => {
        set((state) => {
          return {
            ...state,
            user: {
              username: user.username,
              image: user.image,
              _id: user._id,
              name: user.name,
            },
            token: token,
            isAnonymous: false,
          };
        });
      },
    }),
    { name: "user-storage" }
  )
);

export default useUserStore;

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  token: string;
  username: string;
  image: string;
  name: string;
  _id: string;
  isAnonymous: boolean;
  logOut: () => void;
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
      username: "",
      token: "",
      image: "",
      name: "",
      _id: "",
      isAnonymous: true,
      logOut: () => {
        set((state) => {
          return {
            ...state,
            username: "",
            image: "",
            name: "",
            token: "",
            isAnonymous: true,
            _id: "",
          };
        });
      },
      storeUser: (user, token) => {
        console.log(user, "getting this here");
        set((state) => {
          return {
            ...state,
            username: user.username,
            image: user.image,
            name: user.name,
            token: token,
            isAnonymous: false,
            _id: user._id,
          };
        });
      },
    }),
    { name: "user-storage" }
  )
);

export default useUserStore;

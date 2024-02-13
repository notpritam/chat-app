import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BearState {
  bears: number;
  token: string;
  username: string;
  image: string;
  name: string;
  storeUser: (user: UserType, token: string) => void;
  increase: (by: number) => void;
}

type UserType = {
  username: string;
  name: string;
  image: string;
  _id: string;
};

const useUserStore = create<BearState>()(
  persist(
    (set) => ({
      username: "",
      token: "",
      image: "",
      name: "",
      _id: "",
      bears: 0,
      storeUser: (user, token) => {
        set((state) => {
          return {
            ...state,
            username: user.username,
            image: user.image,
            name: user.name,
            token: token,
            _id: user._id,
          };
        });
      },
      increase: (by) => set((state) => ({ bears: state.bears + by })),
    }),
    { name: "user-storage" }
  )
);

export default useUserStore;

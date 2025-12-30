"use client";

import { useCurrentUserProvider } from "@/provider/CurrentUserProvider";
import Container from "./Container";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constant";
import { formatEnumLabel } from "@/utils/helpers";
import SidebarModal from "./SidebarModal";

function Header() {
  const { data } = useCurrentUserProvider();
  const user = data?.data;

  return (
    <header className="p-0 md:p-3 w-full bg-white sticky top-0  z-40 border-b border-gray-300 lg:border-0">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SidebarModal />
            <h1 className="text-sm md:text-xl font-semibold ">
              Welcome, {user?.profile.name.split(" ")[0]}{" "}
              <span className="text-info">({formatEnumLabel(user?.role ?? "")})</span>
            </h1>
          </div>
          <div className="flex gap-2 items-center   rounded-full font-semibold">
            <img
              className="size-10 rounded-full object-cover"
              src={user?.profile.profilePicture ?? DEFAULT_PROFILE_PICTURE}
              alt=""
            />
            <p className="hidden md:block">{user?.profile.name}</p>
          </div>
        </div>
      </Container>
    </header>
  );
}
export default Header;

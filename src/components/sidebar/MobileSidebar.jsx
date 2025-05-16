import React, { useContext, useRef } from "react";
import { Transition, Backdrop } from "@windmill/react-ui";
import { IoClose } from "react-icons/io5";

//internal import
import SidebarContent from "@/components/sidebar/SidebarContent";
import { SidebarContext } from "@/context/SidebarContext";

function MobileSidebar() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const backdropRef = useRef(null);
  const sidebarRef = useRef(null);
  const parentRef = useRef(null);

  return (
    <Transition show={isSidebarOpen} nodeRef={parentRef}>
      <div ref={parentRef}>
        <Transition
          enter="transition ease-in-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          nodeRef={backdropRef}
        >
          <Backdrop onClick={closeSidebar} ref={backdropRef} className="backdrop-blur-sm bg-gray-900/50" />
        </Transition>

        <Transition
          enter="transition ease-in-out duration-300"
          enterFrom="opacity-0 transform -translate-x-full"
          enterTo="opacity-100 transform translate-x-0"
          leave="transition ease-in-out duration-300"
          leaveFrom="opacity-100 transform translate-x-0"
          leaveTo="opacity-0 transform -translate-x-full"
          nodeRef={sidebarRef}
        >
          <aside 
            className="fixed inset-y-0 z-50 flex flex-col w-72 max-w-[85%] mt-0 overflow-hidden bg-white dark:bg-gray-800 shadow-lg lg:hidden"
            ref={sidebarRef}
          >
            <div className="flex items-center justify-between px-6 py-3 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Menu</h2>
              <button 
                onClick={closeSidebar}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <IoClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </aside>
        </Transition>
      </div>
    </Transition>
  );
}

export default MobileSidebar;

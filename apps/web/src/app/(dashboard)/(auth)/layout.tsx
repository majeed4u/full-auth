import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" w-full h-svh">
      <div className=" flex items-center h-full ">
        <div className=" w-full">{children}</div>
        {/* background gradient with logo.svg */}
        <div className=" flex w-full h-full bg-gradient-to-r from-blue-50 to-cyan-50 items-center justify-center">
          <Image
            width={120}
            height={120}
            src="/images/logo.svg"
            alt="Logo"
            className=""
          />
        </div>
      </div>
    </div>
  );
}

// color blue #3628A0
// color cyan #06D1D4

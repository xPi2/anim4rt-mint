import React from "react";
import Image from "next/image";

const Logo = () => (
  <div className="self-center w-1/2 md:w-2/5">
    <Image src="/logo.png" width="100%" height="100%" layout="responsive" />
  </div>
);

export default Logo;

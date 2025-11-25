"use client";

import { div } from 'framer-motion/client';
import React, { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function studentDashboard() {
  const [openSideBar, setOpenSideBar] = useState(false);
  return(
    <div>
      <Header />
            {openSideBar && (
              <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
            )}
      <div>
        asd
      </div>
    </div>
  )
}
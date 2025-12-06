"use client"

import React from 'react';
import { Book } from "lucide-react"

export function StatsCardModal(props: any) {
  return (
    <div className={`bg-white p-2 rounded-lg shadow flex items-center ${props.holderClassName}`}>
        <p className={`mr-4 ${props.bookClassName}`}>
          {props.icon}
        </p>
      <div>
        <h1 className={`text-md font-semibold ${props.titleClassName}`}>{props.title}</h1>
        <p className={`text-sm font-semibold ${props.textClassName}`}>{props.text}</p>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  totalProducts: number
  expiringCount: number
  openedCount: number
}

export default function QuickStats({ totalProducts, expiringCount, openedCount }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white rounded-2xl p-4 border border-orange-100 text-center">
        <p className="text-2xl font-bold text-orange-600">{totalProducts}</p>
        <p className="text-xs text-gray-600 mt-1">Productos</p>
      </div>

      <div className={`rounded-2xl p-4 border text-center ${expiringCount > 0 ? 'bg-red-50 border-red-300' : 'bg-white border-orange-100'}`}>
        <p className={`text-2xl font-bold ${expiringCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {expiringCount}
        </p>
        <p className="text-xs text-gray-600 mt-1">Próx. a vencer</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-orange-100 text-center">
        <p className="text-2xl font-bold text-blue-600">{openedCount}</p>
        <p className="text-xs text-gray-600 mt-1">Abiertos</p>
      </div>
    </div>
  )
}

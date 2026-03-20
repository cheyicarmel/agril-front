import { create } from 'zustand'

interface MapState {
  center: [number, number]
  zoom: number
  selectedFarmId: number | null
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
  setSelectedFarm: (id: number | null) => void
  resetMap: () => void
}

const BENIN_CENTER: [number, number] = [9.3077, 2.3158]

export const useMapStore = create<MapState>((set) => ({
  center: BENIN_CENTER,
  zoom: 7,
  selectedFarmId: null,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedFarm: (id) => set({ selectedFarmId: id }),
  resetMap: () => set({ center: BENIN_CENTER, zoom: 7, selectedFarmId: null }),
}))
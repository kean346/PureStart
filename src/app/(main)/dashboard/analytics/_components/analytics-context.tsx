"use client";

import { createContext, useContext } from "react";

import { getAnalytics } from "./analytics-data";
export const AnalyticsContext = createContext(getAnalytics("28"));
export const useAnalytics = () => useContext(AnalyticsContext);

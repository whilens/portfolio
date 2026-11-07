"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function registerGsap() {
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger };

import { Montserrat, Forum , Cormorant_Garamond} from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const forum = Forum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-forum",
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cormorant",
});

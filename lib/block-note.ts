import { Theme, lightDefaultTheme } from "@blocknote/react"; // Custom dark theme
export const customDarkTheme = {
  // @ts-ignore
  type: "light",
  colors: {
    editor: {
      text: "#ffffff",
      background: "#020817",
    },
    menu: {
      text: "#ffffff",
      background: "#020817",
    },
    tooltip: {
      text: "#ffffff",
      background: "#020817",
    },
    hovered: {
      text: "#ffffff",
      background: "#280032",
    },
    selected: {
      text: "#ffffff",
      background: "#020817",
    },
    disabled: {
      text: "#9b0000",
      background: "#020817",
    },
    shadow: "#280032",
    border: "#280032",
    sideMenu: "#fff",
    highlightColors: lightDefaultTheme.colors.highlightColors,
  },
  borderRadius: 4,
  fontFamily: "Helvetica Neue, sans-serif",
} satisfies Theme;

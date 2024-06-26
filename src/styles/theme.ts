import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    colors: {
        gray: {
            "900": "#181B23",
            "800": "#1F2029",
            "700": "#353646",
            "600": "#4B4D63",
            "500": "#616480",
            "400": "#797D9A",
            "300": "#9699B0",
            "200": "#B3B5C6",
            "100": "#D1D2DC",
            "50": "#EEEEF2"
        }
    },
    fonts: {
        heading: 'Roboto',
        body: 'DM+Sans'
    },
    styles: {
        global: {
            body: {
                bgGradient: 'linear(to-l, #FFFFFF, #000080)',
                color: 'gray.900'
            }
        }
    }
});
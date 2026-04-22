import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

export const theme = extendTheme({
    config,
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
        global: (props: any) => ({
            body: {
                bg: mode("white", "gray.900")(props),
                color: mode("gray.900", "whiteAlpha.900")(props),
            }
        })
    },
    semanticTokens: {
        colors: {
            "card-bg": { default: "white", _dark: "gray.800" },
            "subtle-bg": { default: "gray.50", _dark: "gray.700" },
            "border-color": { default: "gray.200", _dark: "gray.600" },
        }
    },
    components: {
        Card: {
            baseStyle: (props: any) => ({
                container: {
                    bg: mode("white", "gray.800")(props),
                    borderColor: mode("gray.200", "gray.600")(props),
                }
            })
        },
        Modal: {
            baseStyle: (props: any) => ({
                dialog: { bg: mode("white", "gray.800")(props) },
                header: { color: mode("gray.800", "whiteAlpha.900")(props) },
                body: { color: mode("gray.700", "whiteAlpha.800")(props) },
            })
        },
        Drawer: {
            baseStyle: (props: any) => ({
                dialog: { bg: mode("white", "gray.800")(props) }
            })
        },
        Popover: {
            baseStyle: (props: any) => ({
                content: {
                    bg: mode("white", "gray.800")(props),
                    borderColor: mode("gray.200", "gray.600")(props),
                }
            })
        },
        Menu: {
            baseStyle: (props: any) => ({
                list: {
                    bg: mode("white", "gray.800")(props),
                    borderColor: mode("gray.200", "gray.600")(props),
                },
                item: {
                    bg: mode("white", "gray.800")(props),
                    _hover: { bg: mode("gray.100", "gray.700")(props) },
                }
            })
        },
        Input: {
            variants: {
                filled: (props: any) => ({
                    field: {
                        bg: mode("gray.100", "gray.700")(props),
                        _hover: { bg: mode("gray.200", "gray.600")(props) },
                        _focus: { bg: mode("white", "gray.600")(props) },
                        color: mode("gray.900", "whiteAlpha.900")(props),
                    }
                })
            }
        },
        Select: {
            variants: {
                filled: (props: any) => ({
                    field: {
                        bg: mode("gray.100", "gray.700")(props),
                        _hover: { bg: mode("gray.200", "gray.600")(props) },
                        color: mode("gray.900", "whiteAlpha.900")(props),
                    }
                })
            }
        },
        Textarea: {
            variants: {
                filled: (props: any) => ({
                    bg: mode("gray.100", "gray.700")(props),
                    _hover: { bg: mode("gray.200", "gray.600")(props) },
                    _focus: { bg: mode("white", "gray.600")(props) },
                    color: mode("gray.900", "whiteAlpha.900")(props),
                })
            }
        },
        Table: {
            baseStyle: (props: any) => ({
                th: { borderColor: mode("gray.200", "gray.600")(props) },
                td: { borderColor: mode("gray.200", "gray.600")(props) },
            })
        },
        Accordion: {
            baseStyle: (props: any) => ({
                container: { borderColor: mode("gray.200", "gray.600")(props) },
                button: {
                    _hover: { bg: mode("gray.100", "gray.700")(props) }
                }
            })
        },
        Alert: {
            baseStyle: (props: any) => ({
                container: {
                    _dark: { bg: mode("white", "gray.700")(props) }
                }
            })
        }
    }
});